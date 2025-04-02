import prisma from "../../src/config/prisma-client.js";

export default async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.group.deleteMany(),
    prisma.message.deleteMany(),
  ]);
};
