// __tests__/api/animalAPI.test.js
jest.mock("../../controllers/animalController", () => {
  const originalModule = jest.requireActual("../../controllers/animalController");
  return {
    ...originalModule,
    // mock all route-level handlers
    addRabbit: jest.fn(),
    getRabbit: jest.fn(),
    deleteRabbit: jest.fn(),
    feedRabbit: jest.fn(),
    addFox: jest.fn(),
    getFox: jest.fn(),
    deleteFox: jest.fn(),
    feedFox: jest.fn(),
  };
});

jest.mock("../../models/Animal", () => ({
  find: jest.fn(),
  findOne: jest.fn(),
}));

jest.mock("../../utils/logger", () => ({
  logBackendError: jest.fn(),
  logActionFrontend: jest.fn(),
}));

const request = require("supertest");
const { app } = require("../../app");
const {
  createAnimal,
  removeAnimal,
  feedAnimal,
  sendGridUpdate,
} = require("../../controllers/animalController");
const Animal = require("../../models/Animal");

describe("Animal API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Animal.find.mockResolvedValue([{ species: "rabbit" }]);
    Animal.findOne.mockResolvedValue({ _id: "123", species: "rabbit", alive: true });
    createAnimal.mockResolvedValue({});
    removeAnimal.mockResolvedValue({});
    feedAnimal.mockResolvedValue({});
    sendGridUpdate.mockResolvedValue({});
  });

  test("POST /api/entityRoutes/addRabbit calls createAnimal and returns success", async () => {
    const res = await request(app).post("/api/entityRoutes/addRabbit").send({ gridSize: 5 });
    expect(createAnimal).toHaveBeenCalledWith("Added", "rabbit", 5, true);
    expect(sendGridUpdate).toHaveBeenCalledWith(5);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Rabbit added successfully/);
  });

  test("GET /api/animals/get-rabbit returns success", async () => {
    const res = await request(app).get("/api/animals/get-rabbit");
    expect(Animal.find).toHaveBeenCalledWith({ species: "rabbit" });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Rabbits retreived successfully/);
  });

  test("DELETE /api/animals/delete-rabbit calls removeAnimal and returns success", async () => {
    const res = await request(app).delete("/api/animals/delete-rabbit").send({ gridSize: 5 });
    expect(removeAnimal).toHaveBeenCalledWith("123", true);
    expect(sendGridUpdate).toHaveBeenCalledWith(5);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Rabbit deleted successfully/);
  });

  test("POST /api/animals/feed-rabbit calls feedAnimal and returns success", async () => {
    const res = await request(app).post("/api/animals/feed-rabbit");
    expect(feedAnimal).toHaveBeenCalledWith("123");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Rabbit fed successfully/);
  });

  test("POST /api/animals/add-fox calls createAnimal and returns success", async () => {
    const res = await request(app).post("/api/animals/add-fox").send({ gridSize: 5 });
    expect(createAnimal).toHaveBeenCalledWith("Added", "fox", 5, true);
    expect(sendGridUpdate).toHaveBeenCalledWith(5);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Fox added successfully/);
  });

  test("DELETE /api/animals/delete-fox calls removeAnimal and returns success", async () => {
    Animal.findOne.mockResolvedValueOnce({ _id: "456", species: "fox", alive: true });
    const res = await request(app).delete("/api/animals/delete-fox").send({ gridSize: 5 });
    expect(removeAnimal).toHaveBeenCalledWith("456", true);
    expect(sendGridUpdate).toHaveBeenCalledWith(5);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Fox deleted successfully/);
  });

  test("POST /api/animals/feed-fox calls feedAnimal and returns success", async () => {
    Animal.findOne.mockResolvedValueOnce({ _id: "456", species: "fox", alive: true });
    const res = await request(app).post("/api/animals/feed-fox");
    expect(feedAnimal).toHaveBeenCalledWith("456");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Fox fed successfully/);
  });
});
