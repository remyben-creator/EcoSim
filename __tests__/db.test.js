// __tests__/db.test.js
const mongoose = require("mongoose");

describe("Database Connection", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test_db_connection", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should connect to MongoDB successfully", async () => {
    const state = mongoose.connection.readyState;
    // 1 = connected
    expect(state).toBe(1);
  });

  test("should be able to perform a basic write/read/delete", async () => {
    const TestSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model("TestModel", TestSchema);

    const created = await TestModel.create({ name: "DB Test" });
    const found = await TestModel.findOne({ name: "DB Test" });

    expect(found.name).toBe("DB Test");

    await TestModel.deleteOne({ name: "DB Test" });
  });
});