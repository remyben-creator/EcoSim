// controllers/ecosystemController.js
const { regrowPlantsAll, createPlant } = require("./plantController");
const { ageOneTickAll, createAnimal, moveAll } = require("./animalController");
const { eatPlantAll } = require("./herbivoreController");
const { huntRabbitAll } = require("./carnivoreController");
const Plant = require("../models/Plant");
const Animal = require("../models/Animal");
const Environment = require("../models/Environment");
const { sendGridUpdate } = require("../sockets/gridSocket");
const { logActionFrontend } = require("../sockets/loggerSocket");

//
// Internal simulation helpers
//

let intervalId = null;

// reset DB for fresh run
async function resetDatabase(gridSize) {
    // ! -- works based on no saving
    // todo -- create saving into S3 when time comes
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
        console.error("Error during ecosystem tick:", error);
    }
}

async function runSimulationTick(io) {
    try {
        const environment = await Environment.findOne();
        if (!environment || !environment.isSimulationRunning) {
            clearInterval(intervalId);
            intervalId = null;
            console.log("Simulation stopped or environment not found.");
            return;
        }

        gridSize = environment.width
        await runTick(gridSize);
        await sendGridUpdate(gridSize);
        
        console.log("Simulation tick executed.");
    } catch (error) {
        console.error("Error running simulation tick: ", error);
    }
}

function startSimulationLoop(io) {
    if (intervalId) return console.log("Simulation is already running.");
    logActionFrontend("Simulation", "started");
    console.log("Starting simulation loop...");
    intervalId = setInterval(() => runSimulationTick(io), 1000); // 1 second per tick
}

function stopSimulationLoop(io) {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        logActionFrontend("Simulation", "paused");
        console.log("Simulation loop stopped.");
    }
}
//
// API Route Handlers
//

async function resetEcosystem(req, res) {
    try {
        // ! -- no frontend logging
        // todo -- reset database
        // access the body fields
        const { plantsNum, rabbitsNum, foxesNum, gridSize } = req.body;

        console.log("Resetting with: ", { plantsNum, rabbitsNum, foxesNum, gridSize });

        await resetDatabase();
        await initEcosystem(plantsNum, rabbitsNum, foxesNum, gridSize);
        await sendGridUpdate(gridSize);
        
        res.status(200).json({ message: "Simulation reset successfully."});
    } catch(error) {
        console.error("Error resetting simulation: ", error);
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
        console.error("Error starting simulation: ", error);
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
        console.error("Error pausing simulation: ", error);
        res.status(500).json({ error: "Failed to pause simulation.: " + error.message});
    }
}

async function getEnvironment(req,res) {
    try {
        const environment = await Environment.findOne();
        
        logActionFrontend(`Environment: `, environment.toString());

        res.status(200).json({ message: "Environment retreived successfully."});
    } catch (error) {
        console.error("Error retreiving environment: ", error);
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