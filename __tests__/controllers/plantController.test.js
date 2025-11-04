// __tests__/controllers/plantController.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Plant = require("../../models/Plant");
const {
  createPlant,
  findPlantsInArea,
  regrowPlantsAll,
  removePlant,
} = require("../../controllers/plantController");

const { logActionFrontend } = require("../../sockets/loggerSocket");
const { sendGridUpdate } = require("../../sockets/gridSocket");

// Mock the sockets
jest.mock("../../sockets/loggerSocket", () => ({
  logActionFrontend: jest.fn(),
}));
jest.mock("../../sockets/gridSocket", () => ({
  sendGridUpdate: jest.fn(),
}));

describe("Plant Controller", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await Plant.deleteMany({});
  });

  // --------------------
  // createPlant
  // --------------------
  test("createPlant creates a plant and calls logActionFrontend if api=true", async () => {
    const plant = await createPlant("grass", 5, 10, true);

    expect(plant.species).toBe("grass");
    expect(plant.nutrients).toBe(5);
    expect(plant.position.x).toBeGreaterThanOrEqual(0);
    expect(plant.position.y).toBeGreaterThanOrEqual(0);

    expect(logActionFrontend).toHaveBeenCalledWith("Grass ", "added");
  });

  test("createPlant works without API logging", async () => {
    const plant = await createPlant("grass", 3, 10, false);

    expect(plant.species).toBe("grass");
    expect(logActionFrontend).not.toHaveBeenCalled();
  });

  // --------------------
  // findPlantsInArea
  // --------------------
  test("findPlantsInArea returns plants within bounds", async () => {
    const p1 = await Plant.create({ species: "grass", nutrients: 5, position: { x: 1, y: 1 } });
    const p2 = await Plant.create({ species: "grass", nutrients: 5, position: { x: 4, y: 4 } });

    const results = await findPlantsInArea(0, 2, 0, 2);
    expect(results.length).toBe(1);
    expect(results[0]._id.toString()).toBe(p1._id.toString());
  });

  // --------------------
  // regrowPlantsAll
  // --------------------
  test("regrowPlantsAll increases nutrients of all plants", async () => {
    const p1 = await Plant.create({ species: "grass", nutrients: 1, position: { x: 0, y: 0 } });
    const p2 = await Plant.create({ species: "grass", nutrients: 2, position: { x: 1, y: 1 } });

    await regrowPlantsAll(3);

    const updated1 = await Plant.findById(p1._id);
    const updated2 = await Plant.findById(p2._id);

    expect(updated1.nutrients).toBeGreaterThanOrEqual(4);
    expect(updated2.nutrients).toBeGreaterThanOrEqual(5);
  });

  // --------------------
  // removePlant
  // --------------------
  test("removePlant sets plant as dead and calls logActionFrontend if api=true", async () => {
    const plant = await Plant.create({ species: "grass", nutrients: 5, position: { x: 0, y: 0 } });

    const result = await removePlant(plant._id, true);

    const updated = await Plant.findById(plant._id);
    expect(updated.alive).toBe(false);
    expect(logActionFrontend).toHaveBeenCalledWith("Grass ", "killed by YOU.");
  });

  test("removePlant works without API logging", async () => {
    const plant = await Plant.create({ species: "grass", nutrients: 5, position: { x: 0, y: 0 } });

    const result = await removePlant(plant._id, false);

    const updated = await Plant.findById(plant._id);
    expect(updated.alive).toBe(false);
    expect(logActionFrontend).not.toHaveBeenCalled();
  });
});
