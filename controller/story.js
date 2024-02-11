const {pool}=require('../models/db');

const getAllStories = (req,res)=>{
    const query = `SELECT * FROM stories a WHERE is_deleted=0;`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the stories",
      })}).catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });
    }
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
}

module.exports={getAllStories,createNewStory}
