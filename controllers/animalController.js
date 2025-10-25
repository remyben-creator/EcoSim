// controllers/animalController.js
const Animal = require("../models/Animal");
const { logActionFrontend } = require("../services/loggerService");

// create a new animal (of any type)
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

// Move animal to a new position
async function move(animalId, gridSize = 5) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    // Generate random direction: 0=North, 1=East, 2=South, 3=West
    const direction = Math.floor(Math.random() * 4);
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
    // logActionFrontend(`${animal.species}`, `${animal.name} moved to (${newPosition.x}, ${newPosition.y})`);
    return animal.save();
}

// wrapper for moving all animals at once
async function moveAll(gridSize = 5) {
    const animals = await Animal.find();
    for (let animal of animals) {
        await move(animal._id, gridSize);
    }
}

// remove function for when eaten or dead
async function removeAnimal(animalId) {
    const animal = await Animal.findById(animalId);
    logActionFrontend(`${animal.species}`, `${animal.name} died`)
    return await Animal.findByIdAndDelete(animalId);
}

async function ageOneTick(animalId, energyLoss = 1) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    animal.age += 1;
    animal.energy -= energyLoss;
    // logActionFrontend(`${animal.species}`, `${animal.name} lost ${energyLoss} energy`);

    if (animal.energy <= 0) {
        animal.alive = false;
        await removeAnimal(animalId);
    }

    return animal.save();
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
    defecate,
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