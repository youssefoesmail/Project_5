const express = require("express");
const {
  register,
  login,
  getUserById,
  updateData,
  search
} = require("../controller/users");

const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/:id", getUserById);
userRouter.get("/", search);
userRouter.get("*", (req, res) => {
  res.send("working");
});
userRouter.put("/:id", updateData);

module.exports = userRouter;
