const {pool}=require('../models/db');

const CreateLike = (req,res)=>{
    const user_id = req.token.userId;
    const post_id = req.params.id;
    const values = [user_id,post_id];
    const query = `INSERT INTO likes (user_id,post_id) VALUES ($1, $2) RETURNING *;`;
    
    pool.query(query,values).then((result) => {
        res.status(200).json({
          success: true,
          message: "like was added successfully",
          result: result.rows[0]
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

const getLikeById = (req,res) => {
  const {id} = req.params;
  const query = `SELECT likes.*, posts.id
  FROM likes
  JOIN posts ON posts.id = likes.post_id
  WHERE likes.post_id =$1;`;
  const value = [id];
  pool
  .query(query,value)
  .then((result)=>{
    res.status(200).json({
      success: true,
      result: result.rows
    })
  })
  .catch((err)=>{
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err
    })
  })
}

const getAllLikes = (req,res) => {
  pool
    .query(
      `SELECT likes.* FROM likes;`
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All likes",
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
}

const deleteLike = (req,res)=>{
    const post_id =req.params.id;
    const values = [post_id]
    const query = `DELETE FROM likes WHERE post_id =$1;`;

    pool.query(query,values).then((result) => {
        res.status(200).json({
          success: true,
          message: "like was deleted successfully",
          result: result.rows[0]
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err
        });
      });
}

module.exports = {
    CreateLike,
    deleteLike,
    getLikeById,
    getAllLikes
}