// controllers/plantController.js
const Plant = require("../models/Plant");
const { sendGridUpdate } = require("../sockets/gridSocket");
const { logActionFrontend } = require("../sockets/loggerSocket");
const { logBackendError } = require("../utils/logger");

// create a new plant
async function createPlant(species, nutrients, gridSize, api = false) {
    randomX = Math.floor(Math.random() * gridSize);
    randomY = Math.floor(Math.random() * gridSize);
    const plant = new Plant({ species, nutrients, position: { x: randomX, y: randomY }});

    if (api) logActionFrontend("Grass ", "added");
    return plant.save()
}

// find plants in a 2d area
async function findPlantsInArea(xMin, xMax, yMin, yMax) {
    return Plant.find({
        "position.x": { $gte: xMin, $lte: xMax },
        "position.y": { $gte: yMin, $lte: yMax }
    });
}

// regrow plant
async function regrowPlant(plantId, amount = 1, api = false) {
    const plant = await Plant.findById(plantId);
    if (!plant) return null;
    if (api) logActionFrontend("Single grass ", "regrown");
    return plant.regrow(amount);
}

// regrow all plants (example for a tick)
async function regrowPlantsAll(amount = 1) {
    const plants = await Plant.find()
    for (let plant of plants) {
        await regrowPlant(plant._id, amount);
    }
}

// remove function for when eaten or dead
async function removePlant(plantId, api) {
    const plant = await Plant.findById(plantId);
    if (!plant) return null;
    if (api) logActionFrontend("Grass ", "killed by YOU.");
    return plant.die();
}

//
// API Route Handlers
// 

async function addGrass(req,res) {
   try {
        const { gridSize } = req.body;
        await createPlant("grass", 5, gridSize, true);

        await sendGridUpdate(gridSize);

        res.status(200).json({ message: "Grass added successfully."})
    } catch (error) {
        logBackendError("Error adding grass: ", error);
        res.status(500).json({ error: "Failed to add grass: " + error.message});
    }
}

async function getGrass(req,res) {
    try {
        const grass = await Plant.find({ species: "grass" });
        
        logActionFrontend(`Grass: `, grass.toString());

        res.status(200).json({ message: "Grass retreived successfully."});
    } catch (error) {
        logBackendError("Error retreiving Grass: ", error);
        res.status(500).json({error: "Failed to retreive Grass: " + error.message });
    }
}

async function deleteGrass(req,res) {
    try {
        const { gridSize } = req.body;
        const grass = await Plant.findOne({ species: "grass", alive: true });
        await removePlant(grass._id, true);

        await sendGridUpdate(gridSize);
        
        res.status(200).json({ message: "Grass deleted successfully."});
    } catch (error) {
        logBackendError("Error deleting grass: ", error);
        res.status(500).json({ error: "Failed to delete grass: " + error.message });
    }
}

async function feedGrass(req,res) {
    try {
        const grass = await Plant.findOne({ species: "grass", alive: true });
        if (!grass) throw new Error("No living grass found.")
        await regrowPlant(grass._id, 5, true);
        
        res.status(200).json({ message: "Grass fed successfully."});
    } catch (error) {
        logBackendError("Error feeding grass: ", error);
        res.status(500).json({ error: "Failed to feed grass: " + error.message });
    }
}

module.exports = {
    createPlant,
    findPlantsInArea,
    regrowPlantsAll,
    removePlant,
    addGrass,
    getGrass,
    deleteGrass,
    feedGrass,
}