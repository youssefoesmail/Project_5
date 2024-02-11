const express = require("express");
const { getAllPost, updatePost } = require("../controller/Posts");

const postRouter = express.Router();
postRouter.get("/", getAllPost);
// postRouter.get("/",getallPost);
postRouter.put("/update/:id", updatePost);

postRouter.use("*", (req, res) => {
  res.json("postRouter is working");
});

module.exports = postRouter;
