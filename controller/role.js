const { pool } = require("../models/db");

const createNewPermission = (req, res) => {
    const { permission } = req.body;
    const query = `INSERT INTO permission (permission) VALUES ($1) RETURNING *;`;
    const data = [permission];
  
    pool
      .query(query, data)
      .then((result) => {
        res.status(201).json({
          success: true,
          message: `Permission created successfully`,
          result: result.rows,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: `Server error`,
          err: err,
        });
      });
  };

  module.exports = {
    createNewPermission,
  };
  