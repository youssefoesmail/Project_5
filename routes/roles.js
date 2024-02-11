const express = require("express");

//controllers
const {createNewPermission,} = require("../controllers/role");

const rolesRouter = express.Router();

rolesRouter.post("/permission", createNewPermission);
module.exports = rolesRouter;
