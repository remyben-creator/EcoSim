const express = require("express");
const { resetEcosystem, startSimulation, pauseSimulation } = require("../controllers/environmentController");

const router = express.Router();

router.post("/reset", resetEcosystem);
router.post("/start", startSimulation);
router.post("/pause", pauseSimulation);

module.exports = router;