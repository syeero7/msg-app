import prisma from "../../src/config/prisma-client.js";

export default async () => {
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.group.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};
