// routes/api/entityRoutes.js
const express = require("express");
const { getEnvironment } = require("../../controllers/environmentController");
const {
    addGrass,
    getGrass,
    deleteGrass,
    feedGrass,
} = require("../../controllers/plantController");
const {
    addRabbit,
    getRabbit,
    deleteRabbit,
    feedRabbit,
    addFox,
    getFox,
    deleteFox,
    feedFox,
} = require("../../controllers/animalController");
const router = express.Router();

// add
router.post("/addGrass", addGrass);
router.post("/addRabbit", addRabbit);
router.post("/addFox", addFox);
// get
router.get("/getGrass", getGrass);
router.get("/getRabbit", getRabbit);
router.get("/getFox", getFox);
router.get("/getEnvironment", getEnvironment);
// delete
router.delete("/deleteGrass", deleteGrass);
router.delete("/deleteRabbit", deleteRabbit);
router.delete("/deleteFox", deleteFox);
// feed
router.patch("/feedGrass", feedGrass);
router.patch("/feedRabbit", feedRabbit);
router.patch("/feedFox", feedFox);

module.exports = router;