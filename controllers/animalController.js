// controllers/animalController.js
const Animal = require("../models/Animal");
const { logActionFrontend } = require("../sockets/loggerSocket");
const Plant = require("../models/Plant");

//
// create a new animal (of any type)
//
async function createAnimal(name, species, position) {
    if (!["rabbit", "fox"].includes(species)) {
        throw new Error(`Invalid species type: ${species}`);
    }

    // base defaults
    const defaults = {
        energy: species === "rabbit" ? 10 : 15,
        alive: true,
    }

    const animal = new Animal({
        name,
        species,
        position,
        ...defaults,
    });

    await animal.save();
    return animal;    
}

//
// Move
//

// Move animal to a new position
async function move(animalId, gridSize = 5) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    // Generate random direction: 0=North, 1=East, 2=South, 3=West
    const possibleDirections = [];
    const currentPos = animal.position;
    if (currentPos.y > 0) possibleDirections.push(0); // North
    if (currentPos.x < gridSize - 1) possibleDirections.push(1); // East
    if (currentPos.y < gridSize - 1) possibleDirections.push(2); // South
    if (currentPos.x > 0) possibleDirections.push(3); // West

    const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    let newPosition = { ...currentPos };

    switch (direction) {
        case 0: // North (up)
            newPosition.y = Math.max(0, currentPos.y - 1);
            break;
        case 1: // East (right)
            newPosition.x = Math.min(gridSize - 1, currentPos.x + 1);
            break;
        case 2: // South (down)
            newPosition.y = Math.min(gridSize - 1, currentPos.y + 1);
            break;
        case 3: // West (left)
            newPosition.x = Math.max(0, currentPos.x - 1);
            break;
    }

    animal.position = newPosition;
    animal.energy -= 1;

    if (animal.energy <= 0) {
        animal.alive = false;
        await removeAnimal(animalId);
    } else {
        return animal.save();
    }
}

// Move animal to a new position with hungry search logic
async function moveWithHunger(animalId, gridSize = 5) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    let direction;
    if (animal.species === "rabbit") {
        direction = hungryBFS(animal, "grass", gridSize);
    } else if (animal.species === "fox") {
        direction = hungryBFS(animal, "rabbit", gridSize);
    } else {
        direction = Math.floor(Math.random() * 4);
    }

    // If direction is -1, animal is on target - don't move
    if (direction === -1) return;

    // Move the animal
    const currentPos = animal.position;
    let newPosition = { ...currentPos };

    switch (direction) {
        case 0: // North (up)
            newPosition.y = Math.max(0, currentPos.y - 1);
            break;
        case 1: // East (right)
            newPosition.x = Math.min(gridSize - 1, currentPos.x + 1);
            break;
        case 2: // South (down)
            newPosition.y = Math.min(gridSize - 1, currentPos.y + 1);
            break;
        case 3: // West (left)
            newPosition.x = Math.max(0, currentPos.x - 1);
            break;
    }

    animal.position = newPosition;
    animal.energy -= 1;

    if (animal.energy <= 0) {
        animal.alive = false;
        await removeAnimal(animalId);
    } else {
        return animal.save();
    }
}

// wrapper for moving all animals at once
async function moveAll(gridSize = 5) {
    const animals = await Animal.find();
    for (let animal of animals) {
        if (animal.energy <= 6) {
            await moveWithHunger(animal._id, gridSize);
        }
        else {
            await move(animal._id, gridSize);
        }
    }
}

///////// Move Helper ///////////////////////////

// logic for food search using BFS
async function hungryBFS(animal, target, gridSize = 5) {
    // // Only log for rabbit named "1"
    // const debug = animal.species === "rabbit" && animal.name === "1";

    // if (debug) console.log(`🐇 [hungryBFS] Starting BFS for rabbit '${animal.name}' looking for '${target}'...`);
    // if (debug) console.log(`Current position: (${animal.position.x}, ${animal.position.y})`);

    const queue = [{ position: animal.position, distance: 0 }];
    const visited = new Set();
    const directions = [
        { x: 0, y: -1 }, // North
        { x: 1, y: 0 },  // East
        { x: 0, y: 1 },  // South
        { x: -1, y: 0 }  // West
    ];

    // Get all targets on the grid
    let targets = [];
    if (target === "grass") {
        targets = await Plant.find({ species: "grass" });
    } else if (target === "rabbit") {
        targets = await Animal.find({ species: "rabbit" });
    }

    const targetPositions = new Set(targets.map(t => `${t.position.x},${t.position.y}`));

    // if (debug) {
    //     console.log(`Found ${targets.length} potential targets:`);
    //     console.log([...targetPositions]);
    // }

    // Check if animal is already on a target
    const animalPosKey = `${animal.position.x},${animal.position.y}`;
    if (targetPositions.has(animalPosKey)) {
        // if (debug) console.log(`🐇 Rabbit '${animal.name}' is already on a target!`);
        return -1;
    }

    while (queue.length > 0) {
        const current = queue.shift();
        const posKey = `${current.position.x},${current.position.y}`;

        if (visited.has(posKey)) continue;
        visited.add(posKey);

        // if (debug) {
        //     console.log(`Visiting: (${current.position.x}, ${current.position.y}), distance = ${current.distance}`);
        // }

        // Found a target
        if (targetPositions.has(posKey)) {
            const dx = current.position.x - animal.position.x;
            const dy = current.position.y - animal.position.y;

            let direction;
            if (Math.abs(dx) > Math.abs(dy)) {
                direction = dx > 0 ? 1 : 3; // East or West
            } else {
                direction = dy > 0 ? 2 : 0; // South or North
            }

            // if (debug) {
            //     console.log(`🎯 Target found at (${current.position.x}, ${current.position.y})`);
            //     console.log(`dx=${dx}, dy=${dy}, chosen direction=${direction === 0 ? "North" : direction === 1 ? "East" : direction === 2 ? "South" : "West"}`);
            // }

            return direction;
        }

        // Expand neighbors
        for (const dir of directions) {
            const newX = current.position.x + dir.x;
            const newY = current.position.y + dir.y;

            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
                const newPosKey = `${newX},${newY}`;
                if (!visited.has(newPosKey)) {
                    queue.push({
                        position: { x: newX, y: newY },
                        distance: current.distance + 1
                    });
                    // if (debug) {
                    //     console.log(`Queueing new position: (${newX}, ${newY})`);
                    // }
                }
            } 
            // else if (debug) {
            //     console.log(`Skipping out-of-bounds: (${newX}, ${newY})`);
            // }
        }
    }

    const randomDir = Math.floor(Math.random() * 4);
    // if (debug) console.log(`⚠️ No targets found — choosing random direction: ${randomDir}`);
    return randomDir;
}

//
// Remove
//

// remove function for when eaten or dead
async function removeAnimal(animalId) {
    const animal = await Animal.findById(animalId);
    logActionFrontend(`${animal.species}`, `${animal.name} died`)
    return await Animal.findByIdAndDelete(animalId);
}

async function ageOneTick(animalId, energyLoss = 1) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    animal.energy -= energyLoss;
    // logActionFrontend(`${animal.species}`, `${animal.name} lost ${energyLoss} energy`);

    if (animal.energy <= 0) {
        animal.alive = false;
        await removeAnimal(animalId);
    } else {
        return animal.save();
    }
}

async function ageOneTickAll(energyLoss = 1) {
    const animals = await Animal.find();
    for (let animal of animals) {
        await ageOneTick(animal._id, energyLoss);
    }
}

module.exports = {
    createAnimal,
    moveAll,
    ageOneTickAll,
    removeAnimal,
}

// // Defecation to boost plant growth
// async function defecate(animalId) {
//     const animal = await Animal.findById(animalId);
//     if (!animal) return null;

//     // logic TBD
//     return true;
// }