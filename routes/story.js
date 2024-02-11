const express = require('express');
const { getAllStories } = require('../controller/story');

const storyRouter= express.Router();

storyRouter.get('/',getAllStories);


module.exports=storyRouter;