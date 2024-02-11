const pool = require("../models/db");

const createNewStory = (req, res) => {
  const { photo, video } = req.body;
  const query = `INSERT INTO story (photo || video) VALUES ($1,$2) RETURNING *`;
  const values = [photo, video];
  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "created new story successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "server Error",
        err: err.message,
      });
    });
};
module.exports = {
  createNewStory,
};
