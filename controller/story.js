const { pool } = require("../models/db");

const getAllStories = (req, res) => {
  const query = `SELECT * FROM story a WHERE is_deleted=0;`;
  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the stories",
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
const createNewStory = (req, res) => {
  const { photo_video } = req.body;
  const query = `INSERT INTO story (photo_video) VALUES ($1) RETURNING *`;
  const values = [photo_video];
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
        message: "Server error",
        err: err,
      });
    });
};
const getStoryById = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM story WHERE id = $1 AND is_deleted=0;`;
  const data = [id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `no story with this id: ${id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `The story with id: ${id}`,
          result: result.rows,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

//make the user delete his stroy
const deleteStoryById = (req, res) => {
  const { id } = req.params;
  const query = `UPDATE story SET is_deleted=1 WHERE id=$1;`;
  const data = [id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        res.status(200).json({
          success: true,
          message: `Article with id: ${id} deleted successfully`,
        });
      } else {
        throw new Error("Error happened while deleting article");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

module.exports = {
  getAllStories,
  createNewStory,
  getStoryById,
  deleteStoryById,
};
