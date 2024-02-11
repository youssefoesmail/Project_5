const express = require("express");
const { getAllPost, updatePost, getPostById } = require("../controller/Posts");

const postRouter = express.Router();
postRouter.get("/", getAllPost);
// postRouter.get("/",getallPost);
postRouter.put("/update/:id", updatePost);
postRouter.get("/:id",getPostById);

postRouter.use("*", (req, res) => {
  res.json("postRouter is working");
});

module.exports = postRouter;
