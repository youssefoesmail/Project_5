
const express = require("express");

//controllers
const {createNewPermission,} = require("../controllers/role");

const rolesRouter = express.Router();

rolesRouter.post("/permission", createNewPermission);
module.exports = rolesRouter;


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
  

