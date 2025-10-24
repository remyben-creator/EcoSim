// controllers/plantController.js
const Plant = require("../models/Plant");

// create a new plant
async function createPlant(species, nutrients, position) {
    const plant = new Plant({ species, nutrients, position });
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
async function regrowPlant(plantId, amount = 1) {
    const plant = await Plant.findById(plantId);
    if (!plant) return null;
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
async function removePlant(plantId) {
    return await Plant.findByIdAndDelete(plantId);
}

module.exports = {
    createPlant,
    findPlantsInArea,
    regrowPlantsAll,
    removePlant,
}