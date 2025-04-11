import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import server from "./__server.js";
import {
  getSigninUserResponseBody,
  createUserGroups,
  sendTestMessage,
  createTestImage,
  createTestImageBuffer,
} from "./utils/test-data.js";
import { cloudinaryAPI } from "../src/utils/Cloudianry.js";
import { MAX_IMAGE_UPLOAD_SIZE, IMAGE_DIMENSIONS } from "../src/utils/constants.js";
const { width: IMAGE_WIDTH, height: IMAGE_HEIGHT } = IMAGE_DIMENSIONS;

vi.mock("../src/utils/Cloudianry.js", {
  cloudinaryAPI: { uploadFile: vi.fn(), deleteFile: vi.fn() },
});

describe("/messages", () => {
  describe("[GET] /messages/direct/:userId", () => {
    it("should respond with 401 if not authenticated", async () => {
      const { statusCode } = await request(server).get("/messages/direct/1");

      expect(statusCode).toBe(401);
    });

    it("should respond with 400 status code if param is not a number", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .get("/messages/direct/bah")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(400);
    });

    it("should respond with direct messages", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const user2Id = await sendTestMessage("DIRECT", user.id, token, request, server);
      const { statusCode, body } = await request(server)
        .get(`/messages/direct/${user2Id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("messages");
      expect(body.messages.length).toBe(1);
    });
  });

  describe("[GET] /messages/group/:groupId", () => {
    it("should respond with 403 status code if user is not a member", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const groupId = await sendTestMessage("GROUP", null, null, request, server);
      const { statusCode } = await request(server)
        .get(`/messages/group/${groupId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(403);
    });

    it("should respond with group messages", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groupId = await sendTestMessage("GROUP", user.id, token, request, server);
      const { statusCode, body } = await request(server)
        .get(`/messages/group/${groupId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("messages");
      expect(body.messages.length).toBe(1);
    });
  });

  describe("[POST] /messages/direct/:userId/text", () => {
    it("should respond with 400 status code if message text is empty", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { user: user2 } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .post(`/messages/direct/${user2.id}/text`)
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "" });

      expect(statusCode).toBe(400);
    });

    it("should respond with 201 status code if message created", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { user: user2 } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .post(`/messages/direct/${user2.id}/text`)
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "test" });

      expect(statusCode).toBe(201);
    });
  });

  describe("[POST] /messages/group/:groupId/text", () => {
    it("should respond with 400 status code if message text is empty", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .post(`/messages/group/${groups[0].id}/text`)
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "" });

      expect(statusCode).toBe(400);
    });

    it("should respond with 201 status code if message created", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .post(`/messages/group/${groups[0].id}/text`)
        .set("Authorization", `Bearer ${token}`)
        .send({ text: "test" });

      expect(statusCode).toBe(201);
    });
  });

  describe("[POST] /messages/direct/:userId/image", () => {
    it(`should respond with 400 status code if message image size more than ${MAX_IMAGE_UPLOAD_SIZE}`, async () => {
      const testImage = await createTestImageBuffer(MAX_IMAGE_UPLOAD_SIZE + 1);
      const { token } = await getSigninUserResponseBody(request, server);
      const { user: user2 } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .post(`/messages/direct/${user2.id}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", testImage, "test.png");

      expect(statusCode).toBe(400);
    });

    it(`it should respond with 400 status code if message image is more than ${IMAGE_WIDTH} x ${IMAGE_HEIGHT}`, async () => {
      const testImage = await createTestImage(IMAGE_WIDTH + 1, IMAGE_HEIGHT);
      const { token } = await getSigninUserResponseBody(request, server);
      const { user: user2 } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .post(`/messages/direct/${user2.id}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", testImage, "test.png");

      expect(statusCode).toBe(400);
    });

    it("should respond with 201 status code if message created", async () => {
      vi.mocked(cloudinaryAPI.uploadFile).mockResolvedValue("image url");
      const testImage = await createTestImage(IMAGE_WIDTH, IMAGE_HEIGHT);
      const { token } = await getSigninUserResponseBody(request, server);
      const { user: user2 } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .post(`/messages/direct/${user2.id}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", testImage, "test.png");

      expect(statusCode).toBe(201);
    });
  });

  describe("[POST] /messages/group/:groupId/image", () => {
    it(`should respond with 400 status code if message image size more than ${MAX_IMAGE_UPLOAD_SIZE}`, async () => {
      const testImage = await createTestImageBuffer(MAX_IMAGE_UPLOAD_SIZE + 1);
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .post(`/messages/group/${groups[0].id}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", testImage, "test.png");

      expect(statusCode).toBe(400);
    });

    it(`it should respond with 400 status code if message image is more than ${IMAGE_WIDTH} x ${IMAGE_HEIGHT}`, async () => {
      const testImage = await createTestImage(IMAGE_WIDTH + 1, IMAGE_HEIGHT);
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .post(`/messages/group/${groups[0].id}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", testImage, "test.png");

      expect(statusCode).toBe(400);
    });

    it("should respond with 201 status code if message created", async () => {
      vi.mocked(cloudinaryAPI.uploadFile).mockResolvedValue("image url");
      const testImage = await createTestImage(IMAGE_WIDTH, IMAGE_HEIGHT);
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .post(`/messages/group/${groups[0].id}/image`)
        .set("Authorization", `Bearer ${token}`)
        .attach("image", testImage, "test.png");

      expect(statusCode).toBe(201);
    });
  });
});
