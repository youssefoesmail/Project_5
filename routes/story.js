const express = require("express");
const {
  getAllStories,
  createNewStory,
  DeleteStoryById,
} = require("../controller/story");
const storyRouter = express.Router();
storyRouter.post("/", createNewStory);
storyRouter.get("/", getAllStories);
storyRouter.delete("/:id", DeleteStoryById);
storyRouter.use("*", (req, res) => {
  res.json("storyRouter is working");
});
module.exports = storyRouter;
