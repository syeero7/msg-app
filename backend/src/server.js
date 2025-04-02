import express from "express";
import "./config/passport.js";
import routes from "./api";
import errorHandler from "./middleware/error-handler.js";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/auth", routes.auth);

server.use(errorHandler);

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
