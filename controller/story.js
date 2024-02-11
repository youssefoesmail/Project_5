const {pool}=require('../models/db');

const getAllStories = (req,res)=>{
    const query = `SELECT * FROM stories a WHERE a.is_deleted=0;`;

  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the stories",
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

module.exports={
    getAllStories,
}