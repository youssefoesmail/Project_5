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
// postRouter.get("/:id", getPostById);
// postRouter.put("/:id", updatePost);
// postRouter.delete("/:id", deletePostById);
// postRouter.post("/",createNewPost);
// postRouter.get("/search_1", getPostByAuthor);



module.exports = postRouter;
postRouter.get("*", (req, res) => {
  res.send("postRouter is working");
});