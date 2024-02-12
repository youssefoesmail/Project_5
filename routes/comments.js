const express = require("express");

//controllers
const { createNewComment } = require("../controller/comments");

//middleware
const authentication = require("../middleware/Authentication");
const authorization = require("../middleware/Authorization");

const commentsRouter = express.Router();

commentsRouter.post("/:id",authentication,authorization("CREATE_COMMENT"),createNewComment);

module.exports = commentsRouter;
