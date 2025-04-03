import express from "express";
import "./config/passport.js";
import routes from "./api";
import authenticate from "./middleware/authenticate.js";
import authorize from "./middleware/authorize.js";
import errorHandler from "./middleware/error-handler.js";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/auth", routes.auth);
server.use("/users", authenticate, authorize, routes.users);

server.use(errorHandler);

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
