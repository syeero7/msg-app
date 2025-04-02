import { describe, expect, it } from "vitest";
import request from "supertest";
import { userInput } from "./utils/test-data.js";
import server from "./__server.js";

describe("/auth", () => {
  describe("[POST] /auth/signup", () => {
    it("should respond with 201 status code if successfully registered", async () => {
      const { statusCode } = await request(server).post("/auth/signup").send(userInput);

      expect(statusCode).toBe(201);
    });

    it("should respond with 400 status code and a error if passwords don't match", async () => {
      const { statusCode, body } = await request(server)
        .post("/auth/signup")
        .send({ ...userInput, confirmPassword: "meh" });

      expect(statusCode).toBe(400);
      expect(body).toEqual({ errors: { confirmPassword: expect.anything() } });
    });

    it("should respond with 400 status code and a error if email already in use", async () => {
      await request(server).post("/auth/signup").send(userInput);
      const { statusCode, body } = await request(server)
        .post("/auth/signup")
        .send(userInput);

      expect(statusCode).toBe(400);
      expect(body).toEqual({ errors: { email: expect.anything() } });
    });
  });

  describe("[POST] /auth/signin", () => {
    it("should respond with a token if both email and password is correct", async () => {
      await request(server).post("/auth/signup").send(userInput);
      const { email, password } = userInput;
      const { statusCode, body } = await request(server)
        .post("/auth/signin")
        .send({ email, password });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("token");
    });

    it("should respond with 401 status code and a error if password is incorrect", async () => {
      await request(server).post("/auth/signup").send(userInput);
      const { statusCode, body } = await request(server)
        .post("/auth/signin")
        .send({ email: userInput.email, password: "huh" });

      expect(statusCode).toBe(401);
      expect(body).toEqual({ errors: { password: expect.anything() } });
    });
  });
});
