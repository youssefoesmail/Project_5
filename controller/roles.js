const { pool } = require("../models/db");

// This function creates new permission
const createNewPermission = (req, res) => {
  //TODO: write your code here
  const { permission } = req.body;
  const values = [permission];
  const query = `INSERT INTO permissions (permission) VALUES($1) RETURNING *;`;
  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: `permission created successfully`,
        comments: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err,
      });
    });
};

// This function creates new role permission
const createNewRolePermission = (req, res) => {
  //TODO: write your code here
  const { role_id, permission_id } = req.body;
  const values = [role_id, permission_id];
  const query = `INSERT INTO role_permission (role_id,permission_id) VALUES($1,$2) RETURNING *;`;
  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Role Permission created successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err,
      });
    });
};

module.exports = {
  createNewPermission,
  createNewRolePermission,
};
