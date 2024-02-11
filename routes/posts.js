const express = require("express");
const { getAllPost, updatePost ,deletePostById,createNewPost,getPostByAuthor,} = require("../controller/posts");
const authentication = require("../middleware/Authentication");
const authorization = require("../middleware/Authorization");

const postRouter = express.Router();
postRouter.get("/", getAllPost);
postRouter.put("/:id", updatePost);
postRouter.delete('/:id',deletePostById)
postRouter.post("/",authentication,authorization("CREATE_POST"),createNewPost);
postRouter.get("/search_1", getPostByAuthor);

postRouter.use("*", (req, res) => {
  res.json("postRouter is working");
});

module.exports = postRouter;
