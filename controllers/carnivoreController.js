// controllers/carnivoreController.js
const Animal = require("../models/Animal");
const { removeAnimal } = require("./animalController");
const { logActionFrontend } = require("../sockets/loggerSocket");

// fox hunts rabbits
async function huntRabbit(foxId, rabbitId, energyGain = 5) {
    const fox = await Animal.findById(foxId);
    const rabbit = await Animal.findById(rabbitId);
    if (!fox || 
        fox.species !== "fox" || 
        !rabbit || 
        rabbit.species !== "rabbit" ||
        !fox.alive ||
        !rabbit.alive ) return null;

    rabbit.alive = false;
    await rabbit.save();
    logActionFrontend("Fox", `${fox.name} ate Rabbit ${rabbit.name}`);
    await removeAnimal(rabbitId);

    fox.energy += energyGain;
    logActionFrontend("Fox", `${fox.name} gained ${energyGain} energy`);
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
    huntRabbitAll
};