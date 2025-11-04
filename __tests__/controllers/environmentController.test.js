// __tests__/controllers/environmentController.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Environment = require("../../models/Environment");
const Plant = require("../../models/Plant");
const Animal = require("../../models/Animal");

const {
  resetDatabase,
  initEcosystem,
  runTick,
} = require("../../controllers/environmentController");

// Mock sockets to prevent actual side effects
jest.mock("../../sockets/gridSocket", () => ({
  sendGridUpdate: jest.fn(),
}));
jest.mock("../../sockets/loggerSocket", () => ({
  logActionFrontend: jest.fn(),
}));
jest.mock("../../services/s3StorageService", () => ({
  archiveRunData: jest.fn().mockResolvedValue(),
}));

describe("Environment Controller Helpers", () => {
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
    await Environment.deleteMany({});
    await Plant.deleteMany({});
    await Animal.deleteMany({});
  });

  // --------------------
  // resetDatabase
  // --------------------
  test("resetDatabase clears DB", async () => {
    await Plant.create({ species: "grass", nutrients: 5, position: { x: 0, y: 0 } });
    await Animal.create({ name: "1", species: "rabbit", energy: 5, position: { x: 0, y: 0 } });
    await Environment.create({ width: 5, height: 5, isSimulationRunning: true });

    await resetDatabase();

    const plants = await Plant.find();
    const animals = await Animal.find();
    const environments = await Environment.find();

    expect(plants.length).toBe(0);
    expect(animals.length).toBe(0);
    expect(environments.length).toBe(0);
  });

  // --------------------
  // initEcosystem
  // --------------------
  test("initEcosystem creates environment, plants, and animals", async () => {
    await initEcosystem(2, 1, 1, 5);

    const env = await Environment.findOne();
    const plants = await Plant.find();
    const animals = await Animal.find();

    expect(env.width).toBe(5);
    expect(env.height).toBe(5);
    expect(plants.length).toBe(2);
    expect(animals.length).toBe(2); // 1 rabbit + 1 fox
  });

  // --------------------
  // runTick
  // --------------------
  test("runTick updates ecosystem without crashing", async () => {
    // Create minimal ecosystem
    await initEcosystem(1, 1, 1, 5);

    // runTick should not throw
    await expect(runTick(5)).resolves.not.toThrow();

    // Check that the rabbit or fox energy decreased
    const animals = await Animal.find();
    animals.forEach((animal) => {
        // 20 for fox because there is a rare instance where it could eat a rabbit
        if (animal.species === "fox") expect(animal.energy).toBeLessThanOrEqual(15);
        // 11 for rabbit for same reason
        if (animal.species === "rabbit") expect(animal.energy).toBeLessThanOrEqual(11);
    });

    // Plants should exist
    const plants = await Plant.find();
    expect(plants.length).toBeGreaterThan(0);
  });
});
