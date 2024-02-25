const { pool } = require("../models/db");
const createNewMessage = (req, res) => {
  const { messages } = req.body;
  const receiver_id = req.params.id;
  const sender_id = req.token.userId;
  const value = [receiver_id, sender_id, messages];
  const query = `INSERT INTO messages (receiver_id, sender_id, messages) VALUES ($1, $2, $3) RETURNING *`;
  if (!receiver_id) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID is required.",
    });
  }
  pool
    .query(query, value)
    .then((result) => {
      res.status(200).json({
        success: true,
        messages: "send Message Successfully",
        result: result.rows

      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
};
const getAllMessage = (req, res) => {
  const { receiver_id } = req.params;
  const sender_id = req.token.userId;
  const query = `SELECT * FROM messages
  JOIN users ON messages.sender_id = users.id
  WHERE messages.receiver_id = $1 OR messages.sender_id = $2
  ORDER BY messages.sent_at;`;
  const value = [receiver_id, sender_id];
  pool
    .query(query, value)
    .then((result) => {
      res.status(200).json({
        success: true,
        messages: "get Message Successfully",
        result: result.rows
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
};
module.exports = {
  createNewMessage,
  getAllMessage
};
