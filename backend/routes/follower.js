const express = require('express');
const { createFollower, deleteFollower } = require('../controller/follower');
const authentication = require('../middleware/Authentication');

const followerRouter = express.Router();

followerRouter.post('/:id',authentication,createFollower);
followerRouter.delete('/:id',authentication,deleteFollower);


module.exports= followerRouter;