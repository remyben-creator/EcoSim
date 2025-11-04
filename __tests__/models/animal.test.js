// __tests__/models/animal.test.js
const Animal = require("../../models/Animal");
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
    await Animal.deleteMany({});
});

describe('Animal Class', () => {
    it('should create a rabbit instance with default values', async() => {
        const rabbit = new Animal({
        name: "Bun",
        species: "rabbit",
        position: { x: 2, y: 4 },
        });

        const savedRabbit = await rabbit.save();

        expect(savedRabbit.name).toBe("Bun");
        expect(savedRabbit.species).toBe("rabbit");
        expect(savedRabbit.energy).toBe(10);
        expect(savedRabbit.alive).toBe(true);
    });

    it('should create a fox instance with default values', async() => {
        const fox = new Animal({
        name: "Foxy",
        species: "fox",
        position: { x: 2, y: 4 },
        });

        const savedFox = await fox.save();

        expect(savedFox.name).toBe("Foxy");
        expect(savedFox.species).toBe("fox");
        expect(savedFox.energy).toBe(10);
        expect(savedFox.alive).toBe(true);
    });

    it("should allow an animal to die", async () => {
        const fox = new Animal({ name: "Foxy", species: "fox" });
        await fox.save();

        await fox.die();
        const foundFox = await Animal.findById(fox._id);

        expect(foundFox.alive).toBe(false);
    });

    it("should enforce species enum validation", async () => {
        const invalidAnimal = new Animal({ name: "Weird", species: "dragon" });
        let err;
        try {
        await invalidAnimal.save();
        } catch (error) {
        err = error;
        }
        expect(err).toBeDefined();
        expect(err.name).toBe("ValidationError");
    });

});