const express = require("express");
const { getAllPost, updatePost, getPostById,deletePostById } = require("../controller/Posts");
const postRouter = express.Router();
postRouter.get("/", getAllPost);
postRouter.get("/:id",getPostById);
postRouter.put("/:id", updatePost);
postRouter.delete('/:id',deletePostById)
const { getAllPost, updatePost ,deletePostById} = require("../controller/Posts");
const postRouter = express.Router();
postRouter.get("/", getAllPost);
postRouter.use("*", (req, res) => {
  res.json("postRouter is working");
});

module.exports = postRouter;
