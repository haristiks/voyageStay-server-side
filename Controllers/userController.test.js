const request = require("supertest");
const app = require("../Index"); // Assuming your app is exported from index.js

describe("User Controller Tests", () => {
  let authToken;

  beforeAll(async () => {
    // Perform any setup tasks, like getting an authentication token
    // You might want to create a test user, log in, and store the token
    it("should create a new user", async () => {
      const response = await request(app).post("/api/users/auth/signup").send({
        name: "Test User",
        email: "test@example.com",
        password: "testpassword",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("status", "success");
      // Add more assertions based on your expected response
    });

    it("should login as a user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "testpassword",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("accessToken");

      authToken = response.body.accessToken;
      // Add more assertions based on your expected response
    });
  });

  it("should update user information", async () => {
    const response = await request(app)
      .put("/api/users/update")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Updated Test User",
        image: "updated-image-url",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    // Add more assertions based on your expected response
  });

  it("should create a new listing", async () => {
    // Ensure you have a valid authentication token //
    const response = await request(app)
      .post("/api/users/listings")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Listing",
        description: "Test description",
        // Add other required listing properties
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    // Add more assertions based on your expected response
  });

  // Add more test cases for other controller actions

  afterAll(async () => {
    // Perform any teardown tasks, like cleaning up test data
  });
});
