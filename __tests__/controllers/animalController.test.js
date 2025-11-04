// __tests__/controllers/animalController.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Animal = require("../../models/Animal");
const Plant = require("../../models/Plant");
const { logActionFrontend } = require("../../sockets/loggerSocket");
const animalController = require("../../controllers/animalController");

const {
  createAnimal,
  move,
  moveWithHunger,
  moveAll,
  removeAnimal,
  ageOneTick,
  ageOneTickAll,
  feedAnimal,
} = animalController;

jest.mock("../../sockets/loggerSocket", () => ({
  logActionFrontend: jest.fn(),
}));

describe("Animal Controller", () => {
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

    // --------------------
    // createAnimal tests
    // --------------------
    test("createAnimal creates a new rabbit with default values", async () => {
        const animal = await createAnimal("Bun", "rabbit", 5, true);

        expect(animal.name).toBe("Bun");
        expect(animal.species).toBe("rabbit");
        expect(animal.energy).toBe(10);
        expect(animal.alive).toBe(true);
        expect(animal.position.x).toBeGreaterThanOrEqual(0);
        expect(animal.position.y).toBeGreaterThanOrEqual(0);

        expect(logActionFrontend).toHaveBeenCalledWith("rabbitBun", " added");
    });

    test("createAnimal throws error for invalid species", async () => {
        await expect(createAnimal("Bad", "dog", 5)).rejects.toThrow(
        "Invalid species type: dog"
        );
    });

    // --------------------
    // move tests
    // --------------------
    test("move reduces energy and updates position", async () => {
        const animal = await Animal.create({
        name: "Bun",
        species: "rabbit",
        energy: 5,
        position: { x: 2, y: 2 },
        });

        await move(animal._id, 5);
        const updated = await Animal.findById(animal._id);

        expect(updated.energy).toBe(4);
        expect(updated.position).not.toEqual({ x: 2, y: 2 });
        expect(updated.alive).toBe(true);
    });

    test("move kills animal if energy <= 0 and calls removeAnimal", async () => {
        const animal = await Animal.create({
            name: "Bun",
            species: "rabbit",
            energy: 1,
            position: { x: 0, y: 0 },
        });

        const mockRemove = jest.fn(); // inject mock
        await move(animal._id, 5, mockRemove);

        expect(mockRemove).toHaveBeenCalledWith(animal._id);
    });

    // --------------------
    // moveWithHunger tests
    // --------------------
    test("moveWithHunger moves a rabbit towards grass and decreases energy", async () => {
        // place a plant nearby
        const plant = await Plant.create({ species: "grass", position: { x: 2, y: 1 } });
        const rabbit = await Animal.create({ name: "Bun", species: "rabbit", energy: 5, position: { x: 2, y: 2 } });

        const mockRemove = jest.fn();
        await moveWithHunger(rabbit._id, 5, mockRemove);

        const updated = await Animal.findById(rabbit._id);
        expect(updated.energy).toBe(4);
        // should have moved north (y decreases by 1)
        expect(updated.position).toEqual({ x: 2, y: 1 });
        expect(mockRemove).not.toHaveBeenCalled();
    });

    test("moveWithHunger kills animal if energy reaches 0 and calls removeAnimal", async () => {
        const rabbit = await Animal.create({ name: "Bun", species: "rabbit", energy: 1, position: { x: 2, y: 2 } });
        const mockRemove = jest.fn();

        await moveWithHunger(rabbit._id, 5, mockRemove);

        expect(mockRemove).toHaveBeenCalledWith(rabbit._id);
    });

    // --------------------
    // moveAll tests
    // --------------------
    test("moveAll moves animals based on energy, logging hungry rabbits", async () => {
        const rabbitLow = await Animal.create({ name: "Low", species: "rabbit", energy: 3, position: { x: 0, y: 0 } });
        const rabbitHigh = await Animal.create({ name: "High", species: "rabbit", energy: 10, position: { x: 1, y: 1 } });

        const mockRemove = jest.fn();

        // patch moveWithHunger & move to inject mockRemove
        const animalController = require("../../controllers/animalController");
        const originalMoveWithHunger = animalController.moveWithHunger;
        const originalMove = animalController.move;

        animalController.moveWithHunger = (id, size) => originalMoveWithHunger(id, size, mockRemove);
        animalController.move = (id, size) => originalMove(id, size, mockRemove);

        await moveAll(5);

        const updatedLow = await Animal.findById(rabbitLow._id);
        const updatedHigh = await Animal.findById(rabbitHigh._id);

        // Both should have lost 1 energy
        expect(updatedLow.energy).toBe(2);
        expect(updatedHigh.energy).toBe(9);

        // logActionFrontend should have been called for hungry rabbit
        expect(logActionFrontend).toHaveBeenCalledWith("rabbitLow", " is hungry!");

        // cleanup patches
        animalController.moveWithHunger = originalMoveWithHunger;
        animalController.move = originalMove;
    });

    // --------------------
    // feedAnimal
    // --------------------
    test("feedAnimal increases energy and calls logActionFrontend", async () => {
        const animal = await Animal.create({
        name: "Bun",
        species: "rabbit",
        energy: 5,
        position: { x: 0, y: 0 },
        });

        await feedAnimal(animal._id);

        const updated = await Animal.findById(animal._id);
        expect(updated.energy).toBe(10); // +5
        expect(logActionFrontend).toHaveBeenCalledWith("rabbitBun", "fed");
    });

    // --------------------
    // ageOneTick
    // --------------------
    test("ageOneTick decreases energy and kills if energy <= 0", async () => {
        const animal = await Animal.create({
        name: "Bun",
        species: "rabbit",
        energy: 1,
        position: { x: 0, y: 0 },
        });

        const mockRemove = jest.fn(); // inject mock
        await ageOneTick(animal._id, 1, mockRemove);

        expect(mockRemove).toHaveBeenCalledWith(animal._id);
    });

    // --------------------
    // ageOneTickAll
    // --------------------
    test("ageOneTickAll ages multiple animals", async () => {
        const a1 = await Animal.create({ name: "A1", species: "rabbit", energy: 2, position: { x: 0, y: 0 } });
        const a2 = await Animal.create({ name: "A2", species: "fox", energy: 2, position: { x: 1, y: 1 } });

        const removeSpy = jest.spyOn(animalController, "removeAnimal").mockImplementation(async (id) => id);
        await ageOneTickAll(1);

        const updated1 = await Animal.findById(a1._id);
        const updated2 = await Animal.findById(a2._id);

        expect(updated1.energy).toBe(1);
        expect(updated2.energy).toBe(1);
        expect(removeSpy).not.toHaveBeenCalled();

        removeSpy.mockRestore();
    });
    });
