const express = require("express");
require("dotenv").config();
const cors = require("cors");
require("./models/db");
const app = express();
app.use(express.json());
app.use(cors());
const postRouter = require("./routes/posts");
const userRouter = require("./routes/users");
app.use("/posts", postRouter);

app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.use("/users", userRouter);
const PORT = process.env.PORT || 5000;
app.use("/posts", postRouter);
app.use("*", (req, res) => res.status(404).json("NO content at this path"));
app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
