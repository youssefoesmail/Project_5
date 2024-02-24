const express = require("express");
const {
  createFollower,
  deleteFollower,
  getFollowersUser,
  userFollower
} = require("../controller/follower");
const authentication = require("../middleware/Authentication");

const followerRouter = express.Router();

followerRouter.post("/:id", authentication, createFollower);
followerRouter.delete("/:id", authentication, deleteFollower);
followerRouter.get("/userFollowers/:id", authentication, getFollowersUser);
followerRouter.get("/", authentication, userFollower);

module.exports = followerRouter;
