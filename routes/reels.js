const express = require("express");
const {
  createNewReels,
  getAllReels,
  deletedReels
} = require("../controller/reels");
const authentication = require("../middleware/Authentication");

const reelsRouter = express.Router();
reelsRouter.post("/", authentication, createNewReels);
reelsRouter.get("/", getAllReels);
reelsRouter.delete("/:id", deletedReels);
module.exports = reelsRouter;
