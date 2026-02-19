const express = require("express");
const { register, login } = require("../../controllers/users/usersController");
const usersRouter = express.Router();

usersRouter.post("/api/V1/users/register", register);

usersRouter.post("/api/V1/users/login", login);

module.exports = usersRouter;
