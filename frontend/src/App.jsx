import Posts from "./components/posts/Posts";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login/Login";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Login/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
