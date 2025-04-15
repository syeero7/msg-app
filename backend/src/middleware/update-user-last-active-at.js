import prisma from "../config/prisma-client.js";

const updateUserLastActiveAt = async (req, res, next) => {
  if (!req.user) return res.sendStatus(401);

  const userId = req.user.id;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastActiveAt: new Date(),
    },
  });

  next();
};

export default updateUserLastActiveAt;
