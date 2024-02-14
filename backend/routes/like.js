const express = require('express');
const { CreateLike, deleteLike } = require('../controller/like');
const authentication = require('../middleware/Authentication');

const likeRouter = express.Router();

likeRouter.post('/search/:id',authentication,CreateLike);
likeRouter.delete('/delete/:id',authentication,deleteLike);

module.exports=likeRouter;