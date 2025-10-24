// controllers/ecosystemController.js
const { regrowPlantsAll, createPlant } = require("./plantController");
const { ageOneTickAll, createAnimal } = require("./animalController");
const { eatPlantAll } = require("./herbivoreController");
const { huntRabbitAll } = require("./carnivoreController");
const Plant = require("../models/Plant");
const Animal = require("../models/Animal");

// reset DB for fresh run
async function resetDatabase() {
    await Promise.all([
        Plant.deleteMany({}),
        Animal.deleteMany({}),
    ]);
}

// create simple ecosystem
async function initEcosystem() {
    await createPlant("grass", 5, { x: 0, y: 0 });
    await createPlant("grass", 5, { x: 1, y: 0 });
    await createAnimal("1", "rabbit", { x: 0, y: 0 });
    await createAnimal("2", "rabbit", { x: 0, y: 1 });
    await createAnimal("1", "fox", { x: 1, y: 0 });
}

// simple logger for each tick
function logTick(message) {
    console.log(`[Ecosystem Tick] ${message}`);
}

// run one simulation tick
async function runTick() {
    try {
        logTick("Tick started");

        // regrow plants
        await regrowPlantsAll();
        logTick("Plants regrown");
        // herbivores eat plants
        await eatPlantAll();
        logTick("Herbivores have eaten");
        // carnivores hunt herbivores
        await huntRabbitAll();
        logTick("Carnivores have hunted");
        // age all animals / update energy
        await ageOneTickAll();
        await ageOneTickAll();
        logTick("All animals aged");

        logTick("Tick complete");
    } catch (error) {
        console.error("Error during ecosystem tick:", error);
    }
}

// optional?? run multiple ticks in a sequence or interval
async function runSimulation(tickCount = 10, delayMs = 1000) {
    for (let i = 0; i < tickCount; i++) {
        await runTick();
        await new Promise(resolve => setTimeout(resolve, delayMs));
    }
}

module.exports = {
    resetDatabase,
    initEcosystem,
    runTick,
    runSimulation,
}