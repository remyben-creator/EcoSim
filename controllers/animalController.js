// controllers/animalController.js
const Animal = require("../models/Animal");
const { logAction } = require("../utils/logger");

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
    console.log(`Created ${species} '${animal.name}' at (${position.x}, ${position.y})`);
    return animal;    
}

// Move animal to a new position
async function move(animalId, newPosition) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    animal.position = newPosition;
    return animal.save();
}

// Defecation to boost plant growth
async function defecate(animalId) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    // logic TBD
    return true;
}

async function ageOneTick(animalId, energyLoss = 1) {
    const animal = await Animal.findById(animalId);
    if (!animal) return null;

    animal.age += 1;
    animal.energy -= energyLoss;
    if (animal.energy <= 0) animal.alive = false;

    logAction(`${animal.species}`, `${animal.name} lost ${energyLoss} energy`);
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
    move,
    defecate,
    ageOneTickAll,
}