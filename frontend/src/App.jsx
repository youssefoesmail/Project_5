import Posts from "./components/posts/Posts";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register"

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/post" element={<Posts />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
