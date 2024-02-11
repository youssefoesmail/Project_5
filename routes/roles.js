
const express = require("express");

const {
    createNewPermission,
    createNewRolePermission,
} = require("../controller/roles");

// Create roles router
const roleRouter = express.Router();

roleRouter.post("/permissions",createNewPermission);
roleRouter.post("/role_permission",createNewRolePermission);

roleRouter.use("*", (req, res) => {
    res.json("roleRouter is working");
  });
  
  module.exports = roleRouter;
  