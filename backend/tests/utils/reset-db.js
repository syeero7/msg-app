import prisma from "../../src/config/prisma-client.js";

export default async () => {
  await prisma.$transaction([
    prisma.group.deleteMany(),
    prisma.user.deleteMany(),
    prisma.message.deleteMany(),
  ]);
};
