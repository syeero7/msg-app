import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "./lib/prisma-client.js";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import groups from "./routes/groups.js";
// import messages from "./routes/messages.js";

const server = express();

const { NODE_ENV, ALLOWED_ORIGIN, SECRET, PORT } = process.env;

server.use(
  cors({
    origin: (origin, cb) => {
      if (ALLOWED_ORIGIN === origin || NODE_ENV === "development") {
        cb(null, true);
        return;
      }

      cb(new Error("Not allowed by CORS"));
    },
  })
);
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.uid },
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

server.use("auth", auth);
server.use(passport.authenticate("jwt", { session: false }));
server.use(async (req, res, next) => {
  const userId = req.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { lastActiveAt: new Date() },
  });

  next();
});
server.use("users", users);
server.use("groups", groups);
// server.use("messages");

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

server.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});
