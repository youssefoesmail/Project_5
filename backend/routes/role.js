const express = require("express");
const {
  createNewRole,
  createNewPermission,
  createNewRolePermission,
} = require("../controller/role");
const rolesRouter = express.Router();

//controllers

rolesRouter.post("/", createNewRole);
rolesRouter.post("/permission", createNewPermission);
rolesRouter.post("/role_permission", createNewRolePermission);
module.exports = rolesRouter;
