const auth = (socket, next) => {
  console.log(socket.handshake.headers);
  const headers = socket.handshake.headers;
  console.log("from auth");
  if (headers.user_id) {
    socket.join("room-" + headers.user_id);
    socket.user = { user_id: headers.user_id };
    next();
  } else {
    next(new Error("invalid"));
  }
};
module.exports = { auth };
