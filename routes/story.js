
const express = require('express');
const { getAllStories,createNewStory } = require('../controller/story');
const storyRouter = express.Router();
storyRouter.post("/", createNewStory);
storyRouter.get('/',getAllStories);
storyRouter.use("*", (req, res) => {
  res.json("storyRouter is working");
});
module.exports = storyRouter;
