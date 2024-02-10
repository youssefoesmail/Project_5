const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./routes/users");
require("./models/db");
const app = express();
app.use(express.json());
app.use(cors());

app.use('/users',userRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
