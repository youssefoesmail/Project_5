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
          <Route
            path="/message"
            element={isLoggedIn ? <Message /> : <Login />}
          />
          <Route
            path="/users/:id"
            element={isLoggedIn ? <UsersPage /> : <Login />}
          />
          <Route path="/reels" element={isLoggedIn ? <Reel /> : <Login />} />
          <Route
            path="/personal"
            element={isLoggedIn ? <Personal /> : <Login />}
          />
          <Route path="/post" element={isLoggedIn ? <Posts /> : <Login />} />
          <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/comments"
            element={isLoggedIn ? <Comments /> : <Login />}
          />
          <Route
            path="/followers"
            element={isLoggedIn ? <FollowPost /> : <Login />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
