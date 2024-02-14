const getCommentByReelsId = (req, res) => {
  const { id } = req.params;
  const query = `SELECT comment_reel.comment, comment_reel.reel_id, users.firstName, comment_reel.commenter
    FROM comment_reel
    JOIN users ON users.id = comment_reel.commenter
    WHERE comment_reel.reel_id =$1 AND comment_reel.is_deleted = 0;`;
  const value = [id];
  pool
    .query(query, value)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All comments for story: ${id}`,
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
