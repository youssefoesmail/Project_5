const express = require("express");
const { Server, Socket } = require("socket.io");
const { auth } = require("./middleware/auth");
const { messageHandler } = require("./middleware/message");
const deCode = require("jwt-decode");
const error = require("./middleware/error");
require("dotenv").config();
const cors = require("cors");
require("./models/db");
const io = new Server(8080, { cors: { origin: "*" } });
const app = express();
const client = [];
io.use(auth);
app.use(express.json());
app.use(cors());
const postRouter = require("./routes/posts");
const userRouter = require("./routes/users");
const storyRouter = require("./routes/story");
const commentsRouter = require("./routes/comments");
const rolesRouter = require("./routes/role");
const reelsRouter = require("./routes/reels");
const followerRouter = require("./routes/follower");
const likeRouter = require("./routes/like");
const messagesRouter = require("./routes/message");
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/reels", reelsRouter);
app.use("/story", storyRouter);
app.use("/roles", rolesRouter);
app.use("/comments", commentsRouter);
app.use("/followers", followerRouter);
app.use("/likes", likeRouter);
app.use("/messages", messagesRouter);
const PORT = process.env.PORT || 5000;
app.use("*", (req, res) => res.status(404).json("NO content at this path"));
app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.use(error);
  console.log("connected");
  // socket.use((socket, next) => {});

  const user_id = socket.handshake.headers.user_id;
  client[user_id] = { socket_id: socket.id, user_id };
  console.log(client);
  socket.on("error", (error) => {
    socket.emit("error", { error: error.message });
  });

  messageHandler(socket, io);
  socket.on("disconnect", () => {
    console.log(socket.id); /*  */
    for (const key in client) {
      if (client[key].socket_id === socket.id) {
        delete client[key];
      }
    }
    console.log(client);
  });
});
