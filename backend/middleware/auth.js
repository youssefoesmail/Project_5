const auth = (socket, next) => {
  console.log(socket.handshake.headers);
  const userId = socket.handshake.headers.user_id;
  console.log("from auth");
  if (userId) {
    socket.join("room-" + userId);
    socket.user = { user_id: userId };
    next();
  } else {
    next(new Error("invalid"));
  }
};
module.exports = { auth };
