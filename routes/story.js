const express = require("express");
const {
  getAllStories,
  createNewStory,
  deleteStoryById,
} = require("../controller/story");
const storyRouter = express.Router();
storyRouter.post("/", createNewStory);
storyRouter.get("/", getAllStories);
storyRouter.delete("/:id", deleteStoryById);
storyRouter.use("*", (req, res) => {
  res.json("storyRouter is working");
});
module.exports = storyRouter;
