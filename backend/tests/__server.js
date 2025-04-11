import express from "express";
import "../src/config/passport.js";
import routes from "../src/api";
import authenticate from "../src/middleware/authenticate.js";
import errorHandler from "../src/middleware/error-handler.js";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/auth", routes.auth);
server.use(authenticate);
server.use("/users", routes.users);
server.use("/groups", routes.groups);
server.use("/messages", routes.messages);

server.use(errorHandler);

export default server;
