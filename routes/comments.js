const express = require("express");
const {
  createNewCommentPost,
  createNewCommentStory,
  createNewCommentReels,
  getCommentByPostId,
  getCommentByStoryId,
  getCommentByReelsId
} = require("../controller/comments");

//controllers
//middleware
// const authentication = require("../middleware/Authentication");
// const authorization = require("../middleware/Authorization");

const commentsRouter = express.Router();

commentsRouter.post("/post/:id", createNewCommentPost);
commentsRouter.post("/story/:id", createNewCommentStory);
commentsRouter.post("/reels/:id", createNewCommentReels);
commentsRouter.get("/", getCommentByPostId);
commentsRouter.get("/", getCommentByStoryId);
commentsRouter.get("/", getCommentByReelsId);

module.exports = commentsRouter;
