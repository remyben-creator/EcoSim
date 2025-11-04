// __tests__/controllers/herbivoreController.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Animal = require("../../models/Animal");
const Plant = require("../../models/Plant");
const { removePlant } = require("../../controllers/plantController");
const { logActionFrontend } = require("../../sockets/loggerSocket");
const { eatPlantAll } = require("../../controllers/herbivoreController");

// Mock the dependencies
jest.mock("../../controllers/plantController", () => ({
  removePlant: jest.fn(),
}));

jest.mock("../../sockets/loggerSocket", () => ({
  logActionFrontend: jest.fn(),
}));

describe("Herbivore Controller - eatPlantAll", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await Animal.deleteMany({});
    await Plant.deleteMany({});
  });

  test("rabbit eats nearby plant and gains energy", async () => {
    const rabbit = await Animal.create({
      name: "Bun",
      species: "rabbit",
      energy: 5,
      position: { x: 0, y: 0 },
    });

    const plant = await Plant.create({
      species: "grass",
      nutrients: 3,
      position: { x: 0, y: 0 },
    });

    await eatPlantAll();

    const updatedRabbit = await Animal.findById(rabbit._id);
    const updatedPlant = await Plant.findById(plant._id);

    expect(updatedRabbit.energy).toBe(6); // gained 1
    expect(updatedPlant.nutrients).toBe(2); // lost 1
    expect(removePlant).not.toHaveBeenCalled();
    expect(logActionFrontend).toHaveBeenCalledWith("Rabbit", expect.stringContaining("ate grass"));
  });

  test("rabbit removes plant when nutrients reach 0", async () => {
    const rabbit = await Animal.create({
      name: "Chomp",
      species: "rabbit",
      energy: 4,
      position: { x: 1, y: 1 },
    });

    const plant = await Plant.create({
      species: "grass",
      nutrients: 1,
      position: { x: 1, y: 1 },
    });

    const saveSpy = jest.spyOn(Animal.prototype, "save"); // ← spy on prototype

    await eatPlantAll();

    expect(removePlant).toHaveBeenCalledTimes(1);
    expect(removePlant.mock.calls[0][0].toString()).toBe(plant._id.toString());

    expect(saveSpy).toHaveBeenCalled(); // now it will catch the save from the fetched rabbit
    expect(logActionFrontend).toHaveBeenCalledWith(
      "Rabbit",
      expect.stringContaining("ate grass")
    );
  });

  test("does nothing if rabbit or plant are dead", async () => {
    const rabbit = await Animal.create({
      name: "Ghost",
      species: "rabbit",
      alive: false,
      position: { x: 2, y: 2 },
    });

    const plant = await Plant.create({
      species: "grass",
      nutrients: 5,
      position: { x: 2, y: 2 },
      alive: false,
    });

    await eatPlantAll();

    const sameRabbit = await Animal.findById(rabbit._id);
    expect(sameRabbit.energy).toBe(rabbit.energy);
    expect(removePlant).not.toHaveBeenCalled();
    expect(logActionFrontend).not.toHaveBeenCalled();
  });
});