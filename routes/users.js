
const express = require("express");
const { register, login } = require("../controller/users");

const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("*",(req,res)=>{
res.send("working")
})

module.exports = userRouter;

