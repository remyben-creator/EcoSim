// controllers/herbivoreController.js
const Animal = require("../models/Animal");
const Plant = require("../models/Plant");
const { createAnimal, move, defecate, ageOneTickAll } = require("./animalController");
const { removePlant } = require("./plantController");
const { logActionFrontend } = require("../services/loggerService");

// rabbit eats grass
async function eatPlant(rabbitId, plantId, amount = 1) {
    const rabbit = await Animal.findById(rabbitId);
    if (!rabbit || rabbit.species !== "rabbit") return null;

    const plant = await Plant.findById(plantId);
    if (!plant) return null;

    plant.nutrients -= amount;
    if (plant.nutrients <= 0) await removePlant(plantId);
    else await plant.save();

    rabbit.energy += amount;
    logActionFrontend("Rabbit", `${rabbit.name} ate grass`);
    return rabbit.save()
}

// all wrapper for simulation tick
async function eatPlantAll() {
    const rabbits = await Animal.find({ species: "rabbit", alive: true});
    for (let rabbit of rabbits) {
        // find a nearby plant
        const plant = await Plant.findOne({ 
            "position.x": rabbit.position.x,
            "position.y": rabbit.position.y,
        });
        if (plant) {
            await eatPlant(rabbit._id, plant._id, 1);
        }
    }
}

module.exports = { 
    eatPlantAll, 
    createAnimal, 
    move, 
    defecate, 
    ageOneTickAll 
};