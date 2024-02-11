const express = require("express");
const { createNewStory } = require("../controller/story");
const storyRouter = express.Router();
storyRouter.post("/newstory", createNewStory);
storyRouter.use("*", (req, res) => {
  res.json("storyRouter is working");
});
module.exports = storyRouter;
