const {pool}=require('../models/db');

const CreateLike = (req,res)=>{
    const user_id = req.params.id;
    const post_id = req.query.post_id;
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
}