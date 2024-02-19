import Posts from "./components/posts/Posts";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Comments from "./components/Comments/Comments";
import Personal from "./components/personalPage/Personal";
import FollowPost from "./components/FollowPost/FollowPost";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/personal" element={<Personal />} />
          <Route path="/post" element={<Posts />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/followers"  element = {<FollowPost/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
