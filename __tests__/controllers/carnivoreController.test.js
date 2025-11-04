// __tests__/controllers/carnivoreController.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Animal = require("../../models/Animal");
const { huntRabbitAll } = require("../../controllers/carnivoreController");
const { removeAnimal } = require("../../controllers/animalController");
const { logActionFrontend } = require("../../sockets/loggerSocket");

// Mock dependencies
jest.mock("../../controllers/animalController", () => ({
  removeAnimal: jest.fn(),
}));

jest.mock("../../sockets/loggerSocket", () => ({
  logActionFrontend: jest.fn(),
}));

describe("Carnivore Controller - huntRabbitAll", () => {
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
  });

  test("fox hunts nearby rabbit successfully", async () => {
    const fox = await Animal.create({
      name: "Fang",
      species: "fox",
      energy: 10,
      position: { x: 0, y: 0 },
    });

    const rabbit = await Animal.create({
      name: "Bun",
      species: "rabbit",
      energy: 5,
      position: { x: 0, y: 0 },
    });

    const saveSpy = jest.spyOn(Animal.prototype, "save");

    await huntRabbitAll();

    const updatedFox = await Animal.findById(fox._id);
    const updatedRabbit = await Animal.findById(rabbit._id);

    // Rabbit should be dead and removed
    expect(updatedRabbit.alive).toBe(false);
    expect(removeAnimal.mock.calls[0][0].toString()).toBe(rabbit._id.toString());

    // Fox should gain energy and save called
    expect(updatedFox.energy).toBe(15);
    expect(saveSpy).toHaveBeenCalled();

    // Logging calls
    expect(logActionFrontend).toHaveBeenCalledWith(
      "Fox",
      expect.stringContaining("ate Rabbit")
    );
    expect(logActionFrontend).toHaveBeenCalledWith(
      "Fox",
      expect.stringContaining("gained 5 energy")
    );
  });

  test("does nothing if fox or rabbit are dead", async () => {
    const fox = await Animal.create({
      name: "DeadEye",
      species: "fox",
      alive: false,
      position: { x: 1, y: 1 },
    });

    const rabbit = await Animal.create({
      name: "Ghost",
      species: "rabbit",
      alive: false,
      position: { x: 1, y: 1 },
    });

    const saveSpy = jest.spyOn(Animal.prototype, "save");

    await huntRabbitAll();

    const sameFox = await Animal.findById(fox._id);
    const sameRabbit = await Animal.findById(rabbit._id);

    expect(sameFox.energy).toBe(fox.energy);
    expect(sameRabbit.alive).toBe(false);

    expect(removeAnimal).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
    expect(logActionFrontend).not.toHaveBeenCalled();
  });
});
