// controllers/ecosystemController.js
const { regrowPlantsAll, createPlant } = require("./plantController");
const { ageOneTickAll, createAnimal, moveAll } = require("./animalController");
const { eatPlantAll } = require("./herbivoreController");
const { huntRabbitAll } = require("./carnivoreController");
const Plant = require("../models/Plant");
const Animal = require("../models/Animal");

// global variable to store current gridSize
let currentGridSize = 5;

// reset DB for fresh run
async function resetDatabase() {
    await Promise.all([
        Plant.deleteMany({}),
        Animal.deleteMany({}),
    ]);
}

// create simple ecosystem
async function initEcosystem(grassesNum, rabbitsNum, foxesNum, gridSize) {
    // update global grid size
    currentGridSize = gridSize;

    while (grassesNum > 0) {
        randomX = Math.floor(Math.random() * gridSize);
        randomY = Math.floor(Math.random() * gridSize);
        await createPlant("grass", 5, { x: randomX, y: randomY });
        grassesNum -= 1;
    };
    while (rabbitsNum > 0) {
        randomX = Math.floor(Math.random() * gridSize);
        randomY = Math.floor(Math.random() * gridSize);
        await createAnimal(rabbitsNum.toString(), "rabbit", { x: randomX, y: randomY });
        rabbitsNum -= 1;
    };
    while (foxesNum > 0) {
        randomX = Math.floor(Math.random() * gridSize);
        randomY = Math.floor(Math.random() * gridSize);
        await createAnimal(foxesNum.toString(), "fox", { x: randomX, y: randomY });
        foxesNum -= 1;
    };
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
        // move animals
        await moveAll(currentGridSize);
        logTick("Plants regrown");
        // herbivores eat plants
        await eatPlantAll();
        logTick("Herbivores have eaten");
        // carnivores hunt herbivores
        await huntRabbitAll();
        logTick("Carnivores have hunted");
        // age all animals / update energy
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