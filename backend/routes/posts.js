const express = require("express");
const {
  getAllPost,
  updatePost,
  deletePostById,
  createNewPost,
  getPostByAuthor,
  getPostById,
  getAllPostsUser,
  getAllPostsFollowers
} = require("../controller/posts");
const authentication = require("../middleware/Authentication");
const authorization = require("../middleware/Authorization");
const postRouter = express.Router();
postRouter.get("/", getAllPost);
postRouter.post( 
  "/",
  authentication,
  authorization("CREATE_POST"),
  createNewPost
);
postRouter.get("/search_1/", authentication, getPostByAuthor);
postRouter.get("/:id", authentication, getPostById);
postRouter.put("/:id", authentication, updatePost);
postRouter.delete("/:id", authentication, deletePostById);
postRouter.get("/authorPosts/:user_id", getAllPostsUser);
postRouter.get('/followers/:id',authentication,getAllPostsFollowers);

postRouter.use("*", (req, res) => {
  res.json("postRouter is working");
});

module.exports = postRouter;
postRouter.get("*", (req, res) => {
  res.send("postRouter is working");
});
