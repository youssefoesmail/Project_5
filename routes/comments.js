const express = require("express");
const {
  createNewCommentPost,
  createNewCommentStory,
  createNewCommentReels
} = require("../controller/comments");

//controllers
//middleware
// const authentication = require("../middleware/Authentication");
// const authorization = require("../middleware/Authorization");

const commentsRouter = express.Router();

commentsRouter.post("/:id", createNewCommentPost);
commentsRouter.post("/:id", createNewCommentStory);
commentsRouter.post("/:id", createNewCommentReels);

module.exports = commentsRouter;
