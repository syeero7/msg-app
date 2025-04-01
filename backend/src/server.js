import express from "express";

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
