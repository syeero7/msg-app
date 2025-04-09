import { describe, expect, it } from "vitest";
import request from "supertest";
import server from "./__server.js";
import { getSigninUserResponseBody, createUserGroups } from "./utils/test-data.js";

describe("/groups", () => {
  describe("[GET] /groups", () => {
    it("should respond with 401 if not authenticated", async () => {
      const { statusCode } = await request(server).get("/groups");

      expect(statusCode).toBe(401);
    });

    it("should respond with users groups if successful", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      await createUserGroups(user.id, request, server);
      const { statusCode, body } = await request(server)
        .get("/groups")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("groups");
      expect(body.groups.length).toBe(2);
      expect(body.groups[0]).toHaveProperty("name");
    });
  });

  describe("[GET] /groups/:groupId", () => {
    it("should respond with 400 status code if groupId is not a number", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .get("/groups/huh")
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(400);
    });

    it("should respond with group + members data if successful", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode, body } = await request(server)
        .get(`/groups/${groups[0].id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("group");
      expect(body.group).toHaveProperty("members");
      const { members } = body.group;
      expect(members.length).toBe(3);
      const member = members[0].user;
      expect(member).toHaveProperty("email");
      expect(member).not.toHaveProperty("password");
    });
  });

  describe("[POST] /groups", () => {
    it("should respond with 400 status code if name is empty", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .post("/groups")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "" });

      expect(statusCode).toBe(400);
    });

    it("should respond with 201 status code if successful", async () => {
      const { token } = await getSigninUserResponseBody(request, server);
      const { statusCode } = await request(server)
        .post("/groups")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "test" });

      expect(statusCode).toBe(201);
    });
  });

  describe("[PUT] /groups/:groupId/members", () => {
    it("should respond with 403 status code if request not from group creator", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .put(`/groups/${groups[1].id}/members`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(403);
    });

    it("should respond with 400 if userIds contain creator id", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .put(`/groups/${groups[0].id}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userIds: { add: [], remove: [user.id] } });

      expect(statusCode).toBe(400);
    });

    it("should respond with 204 if successfully update group members", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const member = groups[0].members.find(({ userId }) => userId !== user.id);
      const { statusCode } = await request(server)
        .put(`/groups/${groups[0].id}/members`)
        .set("Authorization", `Bearer ${token}`)
        .send({ userIds: { add: [], remove: [member.userId] } });

      expect(statusCode).toBe(204);
    });
  });

  describe("[DELETE] /groups/:groupId", () => {
    it("should respond with 403 status code if request not from group creator", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .delete(`/groups/${groups[1].id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(403);
    });

    it("should respond with 204 if group deletion successful", async () => {
      const { token, user } = await getSigninUserResponseBody(request, server);
      const groups = await createUserGroups(user.id, request, server);
      const { statusCode } = await request(server)
        .delete(`/groups/${groups[0].id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(204);
    });
  });
});
