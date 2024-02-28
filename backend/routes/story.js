const express = require("express");
const {
  getAllStories,
  createNewStory,
  deleteStoryById,
  getStoryByAuthor
} = require("../controller/story");
const authentication = require("../middleware/Authentication");
const storyRouter = express.Router();
storyRouter.post("/", authentication, createNewStory);
storyRouter.get("/", getAllStories);
storyRouter.delete("/:id", deleteStoryById);
storyRouter.get("/auth", authentication, getStoryByAuthor);
storyRouter.use("*", (req, res) => {
  res.json("storyRouter is working");
});
module.exports = storyRouter;
 