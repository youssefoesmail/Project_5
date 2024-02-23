import Posts from "./components/posts/Posts";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Comments from "./components/Comments/Comments";
import Personal from "./components/personalPage/Personal";
import FollowPost from "./components/FollowPost/FollowPost";
import Reel from "./components/reels/Reel";
import UsersPage from "./components/usersPage/UsersPage";
import Nav from "./components/navbat/Nav";

function App() {
  return (
    <>
      <div>
     
        <h1 className="text-blue-500"></h1>
        <Routes>
          <Route path="/users/:id" element={<UsersPage />} />
          <Route path="/reels" element={<Reel />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/post" element={<Posts />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/followers" element={<FollowPost />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
