// __tests__/models/plant.test.js
const Plant = require("../../models/Plant");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

afterEach(async () => {
    await Plant.deleteMany({});
});

describe('Plant Class', () => {
    it('should create a Plant instance with default values', async() => {
        const plant = await Plant.create({ position: { x: 5, y: 10 } });

        expect(plant.species).toBe("grass");
        expect(plant.nutrients).toBe(5);
        expect(plant.position.x).toBe(5);
        expect(plant.position.y).toBe(10);
        expect(plant.alive).toBe(true);
    });

    it('should increase nutrients when grow() is called', async() => {
        const plant = await Plant.create({ position: { x: 1, y: 1 }, nutrients: 3 });
        await plant.regrow(2);
        const updatedPlant = await Plant.findById(plant._id);
        expect(updatedPlant.nutrients).toBe(5);
    });

    it('should mark plant as dead when die() is called', async() => {
        const plant = await Plant.create({ position: { x: 2, y: 3 } });
        await plant.die();
        const deadPlant = await Plant.findById(plant._id);
        expect(deadPlant.alive).toBe(false);
    })

});