import express from "express";
import "./config/passport.js";
import routes from "./api";
import authenticate from "./middleware/authenticate.js";
import errorHandler from "./middleware/error-handler.js";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/auth", routes.auth);
server.use("/users", authenticate, routes.users);
server.use("/groups", authenticate, routes.groups);

server.use(errorHandler);

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
