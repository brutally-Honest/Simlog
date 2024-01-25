import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { startGetApprovedBlogs } from "../actions/blogActions";
import { jwtDecode } from "jwt-decode";

export const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let token;
    if (localStorage.getItem("token")) {
      token = jwtDecode(localStorage.getItem("token"));
      if (token.role !== "user") dispatch(startGetApprovedBlogs());
    } else dispatch(startGetApprovedBlogs());
  }, []);
  const approvedBlogs = useSelector((state) => state.blogs.data);
  return (
    <>
      <h1>Home</h1>
      {approvedBlogs
        .filter((e) => e.status === "approved").length>0?approvedBlogs
        .filter((e) => e.status === "approved")
        .map((e) => (
          <li key={e._id}>
            <Link to={`/blogs/${e._id}`}>{e.title}</Link>
          </li>
        )):<div>No Blogs Published Yet</div>}
    </>
  );
};
