import Posts from "./components/posts/Posts";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Comments from "./components/Comments/Comments";
import Personal from "./components/personalPage/Personal";
import FollowPost from "./components/FollowPost/FollowPost";
import Reel from "./components/reels/Reel";
import UsersPage from "./components/usersPage/UsersPage";
import { useSelector } from "react-redux";
import Message from "./components/message/Message";
import io from "socket.io-client";
import Home from "./components/home/Home";

function App() {
  const { auth, isLoggedIn } = useSelector((state) => {
    return {
      auth: state.auth,
      isLoggedIn: state.auth.isLoggedIn
    };
  });
  console.log("isLoggedIn", isLoggedIn);
  useEffect(() => {
    console.log(auth.userId);
    const socket = io("http://localhost:8080/", {
      extraHeaders: {
        user_id: auth.userId
      }
    });
    socket?.on("connect", () => {
      console.log(true);
    });
    socket?.on("connect_error", (error) => {
      console.log(false);
      console.error(error.message);
    });
    return () => {
      socket?.close();
      // socket.removeAllListeners();
    };
  }, []);
  return (
    <>
      <div>
        <h1 className="text-blue-500"></h1>
        <Routes>
          <Route path="/message" element={<Message />} />
          <Route path="/users/:id" element={<UsersPage />} />
          <Route path="/reels" element={<Reel />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/post" element={<Posts />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/followers" element={<FollowPost />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
