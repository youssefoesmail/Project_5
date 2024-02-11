const {pool} = require('../models/db');

const getAllPost = (req,res) => {
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
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
}

module.exports = {
    getAllPost,
    deletePostById
}