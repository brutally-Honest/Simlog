import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { BlogsList } from "./components/BlogsList";
import { BlogForm } from "./components/BlogForm";
import { BlogShow } from "./components/BlogShow";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  startGetBlogsType,
  startGetApprovedBlogs,
} from "./actions/blogActions";
import { Navbar } from "./components/Navbar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Users } from "./components/Users";
import { jwtDecode } from "jwt-decode";
import { startGetUsers,  LogIn } from "./actions/userActions";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(LogIn())
      const { role } = jwtDecode(localStorage.getItem("token"));
      if (role === "admin") {
        dispatch(startGetUsers());
        dispatch(startGetBlogsType(""));
      } else if (role === "author"||role === "moderator") dispatch(startGetBlogsType(""));
     else  dispatch(startGetBlogsType('approved'))
    }
  else dispatch(startGetApprovedBlogs())
  }, []);
  return (
    <>
      <h1>Simlog</h1>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs" element={<BlogsList />} />
        <Route path="/blogs/new" element={<BlogForm />} />
        <Route path={`/blogs/:id`} element={<BlogShow />} />
        <Route path={`/blogs/edit/:id`} element={<BlogForm />} />
      </Routes>
    </>
  );
}

export default App;
