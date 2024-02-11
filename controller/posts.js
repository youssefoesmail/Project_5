const { pool } = require("../models/db");
const getAllPost = (req, res) => {
  pool
    .query(`SELECT * FROM posts`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the posts",
        articles: result.rows,
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

const deletePostById = (req,res)=>{
  const id = req.params.id;
  const query = `UPDATE posts SET is_deleted=1 WHERE id=$1;`;
  const data = [id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        res.status(200).json({
          success: true,
          message: `Post with id: ${id} deleted successfully`,
        });
      } else {
        throw new Error("Error happened while deleting post");
      }}).catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });
    }
const updatePost = (req, res) => {
  const { id } = req.params;
  const { body, photo, video } = req.body;
  const query = `UPDATE posts SET body = COALESCE($1,body), photo = COALESCE($2, photo),video = COALESCE($3, video) WHERE id=$4 AND is_deleted = 0  RETURNING *`;
  const values = [body, photo, video, id];
  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "updated post successfully",
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

// getPostById for any user
const getPostById = (req, res) => {
  const { id } = req.params;
  const values = [id];
  const query = `SELECT posts.video, posts.body, posts.photo, posts.created_at, users.first_name, users.last_name FROM posts INNER JOIN users ON users.id = posts.user_id WHERE posts.id = $1; `;
  pool
    .query(query, values)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `The post with id: ${id}`,
        post: result.rows,
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
  getAllPost,
  updatePost,
  getPostById,deletePostById
};


