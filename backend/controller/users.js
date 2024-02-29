const { pool } = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  const { firstname, lastname, email, country, age, password } = req.body;
  const bcryptPassword = await bcrypt.hash(password, 7);
  const role_id = "1";
  const query = `INSERT INTO users (firstname,
    lastname,
    email, 
    password,country,age,role_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
  const values = [
    firstname,
    lastname,
    email.toLowerCase(),
    bcryptPassword,
    country,
    age,
    role_id
  ];
  pool
    .query(query, values)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "created email successfully",
        result: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(409).json({
        success: false,
        massage: "The email already exited",
        err: err.message
      });
    });
};
const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = `SELECT * FROM users WHERE email = $1`;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].id,
              country: result.rows[0].country,
              role: result.rows[0].role_id
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId: result.rows[0].id
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err
      });
    });
};
const getUserById = (req, res) => {
  const { id } = req.params;
  pool
    .query(`SELECT * FROM users WHERE id=$1`, [id])
    .then((result) => {
      res.status(200).json({
        message: "users",
        result: result.rows
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateData = (req, res) => {
  const { id } = req.params;
  const { photo, cover } = req.body;
  const query = `UPDATE users SET photo = COALESCE($1, photo),cover = COALESCE($2, cover) WHERE id=$3 AND is_deleted = 0  RETURNING *`;
  const values = [photo, cover, id];
  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Updated data successfully",
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
const search = async (req, res) => {
  const { name } = req.query;
  const query =
    "SELECT * FROM users WHERE CONCAT(firstname, ' ', lastname) LIKE $1";
  const value = [`%${name}%`];

  try {
    const result = await pool.query(query, value);
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    res.json(err);
  }
};
module.exports = {
  login,
  register,
  getUserById,
  updateData,
  search
};
