// controllers/ecosystemController.js
const { regrowPlantsAll, createPlant } = require("./plantController");
const { ageOneTickAll, createAnimal, moveAll } = require("./animalController");
const { eatPlantAll } = require("./herbivoreController");
const { huntRabbitAll } = require("./carnivoreController");
const Plant = require("../models/Plant");
const Animal = require("../models/Animal");
const Environment = require("../models/Environment");
const { sendGridUpdate } = require("../sockets/gridSocket");
const { logActionFrontend, frontendLogPath } = require("../sockets/loggerSocket");
const { logBackend, logBackendError, backendLogPath } = require("../utils/logger");
const { archiveRunData } = require("../services/s3StorageService");

//
// Internal simulation helpers
//

let intervalId = null;

// reset DB for fresh run
async function resetDatabase() {
    const plants = await Plant.find().lean();
    const animals = await Animal.find().lean();
    const environment = await Environment.findOne().lean();

    // generate unique runId based on timestamp
    const runId = `run_${new Date().toISOString().replace(/[:.]/g, "-")}`;
    // archive everything relating to run
    await archiveRunData(runId, { backendLogPath, frontendLogPath, plants, animals, environment });

    // clear DB
    await Promise.all([
        Plant.deleteMany({}),
        Animal.deleteMany({}),
        Environment.deleteMany({})
    ]);

    logActionFrontend("Database ", "reset");
}

// create simple ecosystem
async function initEcosystem(grassesNum, rabbitsNum, foxesNum, gridSize) {
    const environment = new Environment({
        width: gridSize,
        height: gridSize,
        isSimulationRunning: false,
    });
    await environment.save();

    while (grassesNum > 0) {
        await createPlant("grass", 5, gridSize);
        grassesNum -= 1;
    };
    while (rabbitsNum > 0) {
        await createAnimal(rabbitsNum.toString(), "rabbit", gridSize);
        rabbitsNum -= 1;
    };
    while (foxesNum > 0) {
        await createAnimal(foxesNum.toString(), "fox", gridSize);
        foxesNum -= 1;
    };
    logActionFrontend("Ecosystem ", "initialized");
}

// run one simulation tick
async function runTick(gridSize) {
    try {
        // regrow plants
        await regrowPlantsAll();
        // move animals
        await moveAll(gridSize);
        // herbivores eat plants
        await eatPlantAll();
        // carnivores hunt herbivores
        await huntRabbitAll();
        // age all animals / update energy
        await ageOneTickAll();

        logActionFrontend("Simulation tick ", "executed");
        
    } catch (error) {
        logBackendError("Error during ecosystem tick:", error);
    }
}

async function runSimulationTick(io) {
    try {
        const environment = await Environment.findOne();
        if (!environment || !environment.isSimulationRunning) {
            clearInterval(intervalId);
            intervalId = null;
            logBackend("Simulation stopped or environment not found.");
            return;
        }

        gridSize = environment.width
        await runTick(gridSize);
        await sendGridUpdate(gridSize);
        
        logBackend("Simulation tick executed.");
    } catch (error) {
        logBackendError("Error running simulation tick: ", error);
    }
}

function startSimulationLoop(io) {
    if (intervalId) return logBackend("Simulation is already running.");
    logActionFrontend("Simulation", "started");
    logBackend("Starting simulation loop...");
    intervalId = setInterval(() => runSimulationTick(io), 1000); // 1 second per tick
}

function stopSimulationLoop(io) {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        logActionFrontend("Simulation", "paused");
        logBackend("Simulation loop stopped.");
    }
}
//
// API Route Handlers
//

async function resetEcosystem(req, res) {
    try {
        // access the body fields
        const { plantsNum, rabbitsNum, foxesNum, gridSize } = req.body;

        logBackend("Resetting with: ", { plantsNum, rabbitsNum, foxesNum, gridSize });

        await resetDatabase();
        await initEcosystem(plantsNum, rabbitsNum, foxesNum, gridSize);
        await sendGridUpdate(gridSize);
        
        res.status(200).json({ message: "Simulation reset successfully."});
    } catch(error) {
        logBackendError("Error resetting simulation: ", error);
        res.status(500).json({ error: "Failed to reset simulation."});
    }
}

async function startSimulation(req, res) {
    try {
        // findOne because at any point there should only be one enviroment in DB
        const environment = await Environment.findOne();

        if (!environment) { 
            throw new Error("Environment not found.");
        } 
        if (environment.isSimulationRunning) {
            throw new Error("Simulation is already running.");
        } 
        
        environment.isSimulationRunning = true;
        await environment.save();

        startSimulationLoop(req.io);

        res.status(200).json({ message: "Simulation started successfully."});
    } catch(error) {
        logBackendError("Error starting simulation: ", error);
        res.status(500).json({ error: "Failed to start simulation: " + error.message});
    }
}

async function pauseSimulation(req, res) {
    try {
        // findOne because at any point there should only be one enviroment in DB
        const environment = await Environment.findOne();

        if (!environment) { 
            throw new Error("Environment not found.");
        } 
        if (!environment.isSimulationRunning) {
            throw new Error("Simulation is already paused.");
        } 

        environment.isSimulationRunning = false;
        await environment.save();

        stopSimulationLoop(req.io);

        res.status(200).json({ message: "Simulation paused successfully."});
    } catch(error) {
        logBackendError("Error pausing simulation: ", error);
        res.status(500).json({ error: "Failed to pause simulation.: " + error.message});
    }
}

async function getEnvironment(req,res) {
    try {
        const environment = await Environment.findOne();
        
        logActionFrontend(`Environment: `, environment.toString());

        res.status(200).json({ message: "Environment retreived successfully."});
    } catch (error) {
        logBackendError("Error retreiving environment: ", error);
        res.status(500).json({ error: "Failed to retrieve environment: " + error.message });
    }
}

module.exports = {
    resetDatabase,
    initEcosystem,
    runTick,
    resetEcosystem,
    startSimulation,
    pauseSimulation,
    getEnvironment,
}