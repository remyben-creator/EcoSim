// __tests__/models/environment.test.js
const Environment = require("../../models/Environment");
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
    await Environment.deleteMany({});
});

describe('Environment Class', () => {
    it("should create an environment with given dimensions", async () => {
        const env = new Environment({ width: 100, height: 100 });
        const savedEnv = await env.save();

        expect(savedEnv.width).toBe(100);
        expect(savedEnv.height).toBe(100);
        expect(savedEnv.isSimulationRunning).toBe(false); // default value
    });

    it("should allow updating the simulation state", async () => {
        const env = await Environment.create({ width: 200, height: 200 });
        env.isSimulationRunning = true;
        const updatedEnv = await env.save();

        expect(updatedEnv.isSimulationRunning).toBe(true);
    });
})