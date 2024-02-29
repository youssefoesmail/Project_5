const { pool } = require("../models/db");

const getAllPost = (req, res) => {
  pool
    .query(
      `SELECT posts.*, users.firstname, users.lastname, users.email, users.age, users.country
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      WHERE posts.is_deleted = 0
      ORDER BY created_at;`
    )

    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the posts",
        posts: result.rows
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err
      });
    });
};

const deletePostById = (req, res) => {
  const id = req.params.id;
  const query = `UPDATE posts SET is_deleted=1 WHERE id=$1;`;
  const data = [id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rowCount !== 0) {
        res.status(200).json({
          success: true,
          message: `Post with id: ${id} deleted successfully`
        });
      } else {
        throw new Error("Error happened while deleting post");
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err
      });
    });
};

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
        message: "Updated post successfully",
        result: result.rows
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err
      });
    });
};

const createNewPost = (req, res) => {
  const { body, video, pic } = req.body;
  const user_id = req.token.userId;
  const query = `INSERT INTO posts (body, video,pic, user_id) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const data = [body, video || null, pic || null, user_id];
  pool
    .query(query, data)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Post created successfully",
        result: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message
      });
    });
};
// we have a problem in join statement
const getPostById = (req, res) => {
  const { id } = req.params;
  const values = [id];
  const query = `
    SELECT
      posts.video,
      posts.body,
      posts.photo,
      posts.created_at,
      users.firstname,
      users.lastname
    FROM
      posts
    INNER JOIN
      users ON users.id = posts.user_id
    WHERE
      posts.id = $1;`;

  pool
    .query(query, values)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `No post found with id: ${id}`
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Post with id: ${id}`,
          post: result.rows[0]
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message
      });
    });
};

const getPostByAuthor = (req, res) => {
  const user_id = req.query.user;
  const query = `SELECT * FROM posts WHERE user_id =$1 AND is_deleted=0;`;
  const data = [user_id];

  pool
    .query(query, data)
    .then((result) => {
      console.log(result);
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `The user: ${user_id} has no posts`
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All posts for the user: ${user_id}`,
          result: result.rows
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message
      });
    });
};
const getAllPostsUser = (req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM posts WHERE user_id = $1 AND is_deleted=0;`;
  const data = [user_id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `The user: ${user_id} has no posts`
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All posts for the user: ${user_id}`,
          result: result.rows
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message
      });
    });
};

//! this function will be used for User related to his followers
const getAllPostsFollowers = (req, res) => {
  const user_id = req.params.id;
  const query = `SELECT * FROM posts WHERE user_id = $1 AND is_deleted=0;`;
  const data = [user_id];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `The user: ${user_id} has no posts`
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All posts for the user: ${user_id}`,
          result: result.rows
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message
      });
    });
};

module.exports = {
  getAllPost,
  deletePostById,
  updatePost,
  createNewPost,
  getPostByAuthor,
  getPostById,
  getAllPostsUser,
  getAllPostsFollowers
};
