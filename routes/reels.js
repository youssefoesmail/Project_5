const express = require("express");
const {
  createNewReels,
  getAllReels,
  deletedReels
} = require("../controller/reels");

const reelsRouter = express.Router();
reelsRouter.post("/",createNewReels);
reelsRouter.get("/", getAllReels);
reelsRouter.delete("/:id", deletedReels);
module.exports = reelsRouter;
