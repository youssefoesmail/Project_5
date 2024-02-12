const express = require("express");

const {
  getAllPost,
  updatePost,
  deletePostById,
  createNewPost,
  getPostByAuthor,
  getPostById,
} = require("../controller/posts");
const authentication = require("../middleware/Authentication");
const authorization = require("../middleware/Authorization");
const postRouter = express.Router();

postRouter.get("/", getAllPost);
postRouter.get("/:id", getPostById);
postRouter.put("/:id", updatePost);
postRouter.post(
  "/",
  authentication,
  authorization("CREATE_POST"),
  createNewPost
);
postRouter.get("/search_1", getPostByAuthor);
postRouter.delete("/:id", deletePostById);

postRouter.use("*", (req, res) => {
  res.json("postRouter is working");
});

module.exports = postRouter;
