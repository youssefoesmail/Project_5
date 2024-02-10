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
}

module.exports = {
    getAllPost
}