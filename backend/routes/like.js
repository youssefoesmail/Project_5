const express = require('express');
const { CreateLike, deleteLike } = require('../controller/like');

const likeRouter = express.Router();

likeRouter.post('/search/:id',CreateLike);
likeRouter.delete('/:id',deleteLike);

module.exports=likeRouter;