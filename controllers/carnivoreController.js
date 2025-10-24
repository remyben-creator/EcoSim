// controllers/carnivoreController.js
const Animal = require("../models/Animal");
const { createAnimal, move, defecate, ageOneTickAll } = require("./animalController");
const { removeHerbivore } = require("./herbivoreController");
const { logAction } = require("../utils/logger");

// fox hunts rabbits
async function huntRabbit(foxId, rabbitId, energyGain = 5) {
    const fox = await Animal.findById(foxId);
    const rabbit = await Animal.findById(rabbitId);
    if (!fox || fox.species !== "fox" || !rabbit || rabbit.species !== "rabbit") return null;

    rabbit.alive = false;
    await rabbit.save();
    logAction("Fox", `${fox.name} ate Rabbit ${rabbit.name}`);
    await removeHerbivore(rabbitId);

    fox.energy += energyGain;
    logAction("Fox", `${fox.name} gained ${energyGain} energy`);
    return fox.save();
}

// all wrapper for simulation tick
async function huntRabbitAll() {
    const foxes = await Animal.find({ species: "fox", alive: true });
    for (let fox of foxes) {
        // find a nearby rabbit
        const rabbit = await Animal.findOne({
            "species": "rabbit",
            "alive": true,
            "position.x": fox.position.x,
            "position.y": fox.position.y,
        });
        if (rabbit) {
            await huntRabbit(fox._id, rabbit._id, 5);
        }
    }
}

module.exports = { 
    huntRabbitAll, 
    createAnimal,
    move, 
    defecate, 
    ageOneTickAll 
};