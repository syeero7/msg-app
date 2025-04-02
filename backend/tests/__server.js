import express from "express";
import "../src/config/passport.js";
import routes from "../src/api";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/auth", routes.auth);

export default server;
