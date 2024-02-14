const pool = require("../models/db");

const createNewCommentPost = (req, res) => {
  const post_id = req.params.id;
  const commenter = req.token.userId;

  const { comment } = req.body;

  const query = `INSERT INTO comment_posts (comment, commenter, post_id) VALUES ($1,$2,$3) RETURNING *`;
  const data = [comment, commenter, post_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        result: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(404).json({
        success: false,
        message: "Server error",
        err: err
      });
    });
};
const createNewCommentStory = (req, res) => {
  const story_id = req.params.id;
  const commenter = req.token.userId;

  const { comment } = req.body;

  const query = `INSERT INTO comment_story (comment, commenter, story_id) VALUES ($1,$2,$3) RETURNING *`;
  const data = [comment, commenter, story_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        result: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(404).json({
        success: false,
        message: "Server error",
        err: err
      });
    });
};
const createNewCommentReels = (req, res) => {
  const reel_id = req.params.id;
  const commenter = req.token.userId;

  const { comment } = req.body;

  const query = `INSERT INTO comment_reel (comment, commenter, reel_id) VALUES ($1,$2,$3) RETURNING *`;
  const data = [comment, commenter, reel_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Comment created successfully",
        result: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(404).json({
        success: false,
        message: "Server error",
        err: err
      });
    });
};

module.exports = {
  createNewCommentPost,
  createNewCommentStory,
  createNewCommentReels
};
