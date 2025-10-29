const express = require("express");
const { resetEcosystem, startSimulation, pauseSimulation, getEnvironment } = require("../controllers/environmentController");

const router = express.Router();

router.post("/reset", resetEcosystem);
router.post("/start", startSimulation);
router.post("/pause", pauseSimulation);
router.get("/getEnvironment", getEnvironment);

module.exports = router;