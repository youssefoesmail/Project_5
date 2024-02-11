const express = require("express");
const {getAllPost,deletePostById}=require('../controller/posts')

const postRouter = express.Router();
postRouter.get("/",getAllPost)
postRouter.delete('/:id',deletePostById)


postRouter.use("*", (req, res) => {
    res.json("postRouter is working");
  });

  module.exports = postRouter;