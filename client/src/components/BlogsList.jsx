import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {  useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import {
  startChangeBlogStatus,
  startDeleteBlog,
  startGetBlogsType,
} from "../actions/blogActions";
import { jwtDecode } from "jwt-decode";

export const BlogsList = () => {
  const [modal, setModal] = useState(false);
  const [blog, setBlog] = useState({ type: "", data: {} });
  const toggle = () => setModal(!modal);
  const dispatch = useDispatch();
  let token;
  if (localStorage.getItem("token")) {
    token = jwtDecode(localStorage.getItem("token"));
  }

  const blogs = useSelector((state) => {
    return state.blogs.data;
  });


  const handleDelete = (blog) => {
    setBlog({ type: "delete", data: blog });
    toggle();
  };

  const handleFilter = (value) => {
    setSelectBlogType(value);
    dispatch(startGetBlogsType(value));
  };
  const handleStatus = (blog, status) => {
    setBlog({ type: status, data: blog });
    toggle();
  };
  const handleAction = (blog, type) => {
    if (type === "delete") {
      dispatch(startDeleteBlog(blog._id));
    } else if (type === "approved" || type === "rejected") {
      dispatch(startChangeBlogStatus(blog._id, type));
    }
    toggle();
  };

  const [selectBlogType, setSelectBlogType] = useState("all");
  return (
    <>
      <h2 className="lh">BlogsList</h2>
      <h2>Listing Blogs - {token.role==='author'?blogs?.filter(e=>token?.id===e.author?._id).length:blogs.length}</h2>
      <div>
        {token.role === "admin" ||
          (token.role === "moderator" && (
            <select
              className="blogSelect"
              value={selectBlogType}
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value={"all"}>ALL</option>
              <option value={"pending"}>Pending</option>
              <option value={"approved"}>Approved</option>
              <option value={"rejected"}>Rejected</option>
            </select>
          ))}

        {blogs?.length > 0 ? (
          <Table dark bordered className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(token.role==='admin'||token.role==='moderator')?blogs.map((e) => (
                <tr key={e._id}>
                  <td>
                    <Link to={`/blogs/${e._id}`}>
                      <span className="px">{e.title}</span>
                    </Link>
                  </td>
                  {(token.role === "admin" || token.role === "author") && (
                    <td>
                      <button onClick={() => handleDelete(e)}>Delete</button>
                    </td>
                  )}
                  {token.role === "moderator" &&
                    (e.status === "pending" ? (
                      <td>
                        <button onClick={() => handleStatus(e, "approved")}>
                          Approve
                        </button>
                        <button onClick={() => handleStatus(e, "rejected")}>
                          Reject
                        </button>
                      </td>
                    ) : (
                      <td>{e.status}</td>
                    ))}
                </tr>
              )):blogs?.filter(e=>token?.id===e.author?._id).map((e) => (
                <tr key={e._id}>
                  <td>
                    <Link to={`/blogs/${e._id}`}>
                      <span className="px">{e.title}</span>
                    </Link>
                  </td>
                  {(token.role === "admin" || token.role === "author") && (
                    <td>
                      <button onClick={() => handleDelete(e)}>Delete</button>
                    </td>
                  )}
                  {token.role === "moderator" &&
                    (e.status === "pending" ? (
                      <td>
                        <button onClick={() => handleStatus(e, "approved")}>
                          Approve
                        </button>
                        <button onClick={() => handleStatus(e, "rejected")}>
                          Reject
                        </button>
                      </td>
                    ) : (
                      <td>{e.status}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>
            <h3>
              No Blogs found
              {token?.role === "author" && ", Add your first blog"}
            </h3>
          </div>
        )}
        {token?.role === "author" && <Link to="/blogs/new">Add Blog</Link>}
      </div>
      <Modal className="colorModal" isOpen={modal} toggle={toggle} {...blog}>
        <ModalHeader toggle={toggle}>
          {blog.type === "delete" && <span>Delete Blog</span>}
          {blog.type === "approved" && <span>Approve Blog</span>}
          {blog.type === "rejected" && <span>Reject Blog</span>}
        </ModalHeader>
        <ModalBody>
          {blog.type === "delete" && (
            <span>
              Are you sure you want delete <b>{blog.data.title}</b> ?
            </span>
          )}
          {blog.type === "approved" && (
            <span>
              Are you sure you want Approve <b>{blog.data.title}</b> ?
            </span>
          )}
          {blog.type === "rejected" && (
            <span>
              Are you sure you want Reject <b>{blog.data.title}</b> ?
            </span>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color={
              blog.type === "delete" || blog.type === "rejected"
                ? "danger"
                : "primary"
            }
            onClick={() => handleAction(blog.data, blog.type)}
          >
            {blog.type === "delete" && <span>Delete </span>}
            {blog.type === "approved" && <span>Approve </span>}
            {blog.type === "rejected" && <span>Reject </span>}
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setBlog({ type: "", data: {} });
              toggle();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
