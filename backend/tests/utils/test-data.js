import sharp from "sharp";
import prisma from "../../src/config/prisma-client";

export const userInput = {
  firstName: "John",
  lastName: "Doe",
  email: "john1@mail.com",
  password: "password",
  confirmPassword: "password",
};

export const getSigninUserResponseBody = async (request, server, data = userInput) => {
  await request(server).post("/auth/signup").send(data);
  const { email, password } = data;
  const { body } = await request(server).post("/auth/signin").send({ email, password });
  return body;
};

const createGroup = (creatorId, memberIds) => {
  const members = [creatorId, ...memberIds];
  return prisma.group.create({
    data: {
      name: "test",
      creator: {
        connect: {
          id: creatorId,
        },
      },
      members: {
        createMany: {
          data: members.map((userId) => ({ userId })),
        },
      },
    },
    include: { members: true },
  });
};

const users = [
  { ...userInput, email: "joeOn@mail.com" },
  { ...userInput, email: "doeJJ01@mail.com" },
];

export const createUserGroups = async (userId, request, server) => {
  const { user: user1 } = await getSigninUserResponseBody(request, server, users[0]);
  const { user: user2 } = await getSigninUserResponseBody(request, server, users[1]);

  return await prisma.$transaction([
    createGroup(userId, [user1.id, user2.id]),
    createGroup(user1.id, [userId, user2.id]),
    createGroup(user1.id, [user2.id]),
  ]);
};

export const createTestImage = async (imageWidth, imageHight) => {
  const imgOptions = {
    width: imageWidth,
    height: imageHight,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  };
  const imageBuffer = await sharp({ create: imgOptions }).png().toBuffer();
  return imageBuffer;
};

export const createTestImageBuffer = async (size) => {
  const bytes = size * 1024 * 1024;
  const arrayBuffer = new ArrayBuffer(bytes);
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  return Buffer.from(await blob.arrayBuffer());
};
