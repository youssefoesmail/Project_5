const express = require("express");
const { getAllPost, updatePost ,deletePostById} = require("../controller/Posts");
const postRouter = express.Router();
postRouter.get("/", getAllPost);
postRouter.put("/:id", updatePost);
postRouter.delete('/:id',deletePostById)


postRouter.use("*", (req, res) => {
  res.json("postRouter is working");
});

module.exports = postRouter;
