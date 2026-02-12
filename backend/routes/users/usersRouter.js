const express = require("express");
const {register} = require("../../controllers/users/usersController");
const usersRouter = express.Router();

usersRouter.post("/api/V1/users/register",register);

module.exports = usersRouter;