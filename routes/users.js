const express = require('express');
const { login } = require('../controller/users');

const userRouter = express.Router();

userRouter.post('/users/login',login);

module.exports = userRouter;