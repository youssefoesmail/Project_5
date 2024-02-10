const express = require("express");
const { getAllPost } = require("../controller/Posts");


const postRouter = express.Router();
postRouter.get("/",getAllPost)
// postRouter.get("/",getallPost);

postRouter.use("*", (req, res) => {
    res.json("postRouter is working");
  });

  module.exports = postRouter;