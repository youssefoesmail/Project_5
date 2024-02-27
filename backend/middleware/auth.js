const auth = (socket, next) => {
  console.log(socket.handshake.headers);
  const headers = socket.handshake.headers;
  console.log("from auth");
  if (headers.token) {
    socket.join("room-" + headers.user_id)
    socket.user = { token: headers.token, user_id: headers.user_id };
    next();
  } else {
    next(new Error("invalid"));
  }
};
module.exports = { auth };
