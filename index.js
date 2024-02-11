const express = require("express");
require("dotenv").config();
const cors = require("cors");
const postRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const storyRouter = require("./routes/story");
require("./models/db");
const app = express();
app.use(express.json());
app.use(cors());

app.use('/users',userRouter);
const PORT = process.env.PORT || 5000;
app.use("/posts",postRouter)
app.use('/stories',storyRouter);
app.use("*", (req, res) => res.status(404).json("NO content at this path"));
app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
