const { pool } = require("../models/db");

const createFollower =(req,res)=>{
    const following_user_id = req.token.userId;
    const followed_user_id = req.params.id;
    const values = [following_user_id,followed_user_id]
    const query = `INSERT INTO follows (following_user_id, followed_user_id) VALUES ($1, $2) RETURNING *;`

    pool.query(query,values).then((result) => {
        res.status(200).json({
          success: true,
          message: "follower was added successfully",
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

const deleteFollower = (req,res)=>{

    const following_user_id = req.params.id;
    const values = [following_user_id]
    const query = `UPDATE follows SET is_deleted=1 WHERE following_user_id=$1;`

    pool.query(query,values).then((result) => {
        res.status(200).json({
          success: true,
          message: "follower was deleted successfully",
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

const getFollowersUser = (req,res)=>{
    const followed_user_id = req.params.id;
    const values = [followed_user_id];
    const query = `select * from follows WHERE followed_user_id=$1`

    pool.query(query,values).then((result) => {
        res.status(200).json({
          success: true,
          message: `followers for user ${followed_user_id}`,
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
    createFollower,
    deleteFollower,
    getFollowersUser,
}