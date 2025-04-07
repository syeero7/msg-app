import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import server from "./__server.js";
import {
  createTestImage,
  createTestImageBuffer,
  getSigninUserResponseBody,
} from "./utils/test-data.js";
import { cloudinaryAPI } from "../src/utils/Cloudianry.js";
import {
  MAX_FILE_UPLOAD_SIZE_IN_MEGA_BYTES as MAX_FILE_SIZE,
  UPLOAD_IMAGE_SIZE_IN_PIXELS as UPLOAD_IMAGE_SIZE,
} from "../src/utils/constants.js";

vi.mock("../src/utils/Cloudianry.js", {
  cloudinaryAPI: { uploadFile: vi.fn(), deleteFile: vi.fn() },
});

describe("/users", () => {
  describe("[GET] /users", () => {
    it("should respond with 401 if not authenticated", async () => {
      const { statusCode } = await request(server).get("/users");

      expect(statusCode).toBe(401);
    });

    it("should respond with users data if successful", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode, body } = await request(server)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("users");
      const user = body.users[0];
      expect(user).toHaveProperty("firstName");
      expect(user).not.toHaveProperty("password");
    });
  });

  describe("[GET] /users/online", () => {
    it("should respond with online users if successful", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode, body } = await request(server)
        .get("/users/online")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("users");
      const user = body.users[0];
      expect(user).toHaveProperty("firstName");
      expect(user).not.toHaveProperty("password");
    });

    it("should respond with empty users if successful", async () => {
      const oneSecond = 1000 * 60;
      const { token } = await getSigninUserResponseBody(request, server);
      vi.useFakeTimers().advanceTimersByTime(oneSecond + 1);
      const { statusCode, body } = await request(server)
        .get("/users/online")
        .set("Authorization", `Bearer ${token}`);
      vi.clearAllTimers();

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("users");
      expect(body.users).toEqual([]);
    });
  });

  describe("[GET] /users/:userId", () => {
    it("should respond with user details if successful", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const { statusCode, body } = await request(server)
        .get(`/users/${user.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("user");
      expect(body.user).not.toHaveProperty("password");
    });

    it("should respond with 400 status code if userId is not a number", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .get("/users/sup")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(400);
    });

    it("should respond with 404 status code if user not found", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .get("/users/0")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(404);
    });
  });

  describe("[PUT] /users/:userId", () => {
    it("should respond with 403 status code if userId param not equal to authenticated users id", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .put("/users/0/avatar")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(403);
    });

    it("should respond with 204 status code if successfully updated the user avatar", async () => {
      vi.mocked(cloudinaryAPI.uploadFile).mockResolvedValue("image-url");

      const testImage = await createTestImage(UPLOAD_IMAGE_SIZE);
      const { token, user } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .put(`/users/${user.id}/avatar`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", testImage, "test.png");

      expect(statusCode).toBe(204);
    });

    it(`should respond with 400 status code if file size is more than ${MAX_FILE_SIZE}MB`, async () => {
      const testImage = await createTestImageBuffer(MAX_FILE_SIZE + 1);
      const { token, user } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .put(`/users/${user.id}/avatar`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", testImage, "test.png");

      expect(statusCode).toBe(400);
    });

    it(`should respond with 400 status code if image width/hight more than ${UPLOAD_IMAGE_SIZE}px`, async () => {
      const testImage = await createTestImage(UPLOAD_IMAGE_SIZE + 1);
      const { token, user } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .put(`/users/${user.id}/avatar`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", testImage, "test.png");

      expect(statusCode).toBe(400);
    });

    it("should respond with 400 status code if about me field have more than 200 characters", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .put(`/users/${user.id}/about`)
        .set("Authorization", `Bearer ${token}`)
        .send({ aboutMe: "a".repeat(201) });

      expect(statusCode).toBe(400);
    });

    it("should respond with 204 status code if successfully updated about me", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .put(`/users/${user.id}/about`)
        .set("Authorization", `Bearer ${token}`)
        .send({ aboutMe: "a".repeat(100) });

      expect(statusCode).toBe(204);
    });
  });

  describe("[DELETE] /users/:userId", () => {
    it("should respond with 204 status code if successfully deleted the user avatar", async () => {
      vi.mocked(cloudinaryAPI.uploadFile).mockResolvedValue("image-url");
      const testImage = await createTestImage(UPLOAD_IMAGE_SIZE);
      const { token, user } = await getSigninUserResponseBody(request, server);
      await request(server)
        .put(`/users/${user.id}/avatar`)
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", testImage, "test.png");

      const { statusCode } = await request(server)
        .delete(`/users/${user.id}/avatar`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(204);
    });

    it("should respond with 403 status code if userId param not equal to authenticated users id", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .delete("/users/0/avatar")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(403);
    });
  });
});
