import axios from "../config/axios";
export const startGetApprovedBlogs = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("/api/blogs");
      dispatch(setBlogs(response.data));
    } catch (e) {
      console.log(e.response.data);
    }
  };
};

export const startGetBlogsType = (typeOfBlogs) => {
  return async (dispatch) => {
    try {
      const blogsType = await axios.get(`/api/blogs-type?type=${typeOfBlogs}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(setBlogs(blogsType.data));
    } catch (e) {
      console.log(e.response);
    }
  };
};
const setBlogs = (blogs) => {
  return { type: "SET_BLOGS", payload: blogs };
};

export const startCreateBlog = ({ formData, redirect, resetForm }) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/blogs", formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(addBlog(response.data));
      resetForm();
      redirect(response.data._id);
    } catch (e) {
      console.log(e.response);
    }
  };
};

const addBlog = (blog) => {
  return { type: "ADD_BLOG", payload: blog };
};

export const startDeleteBlog = (id) => {
  return async (dispatch) => {
    try {
      const deletedBlog = await axios.delete(`/api/blogs/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log(deletedBlog.data);
      dispatch(deleteBlog(deletedBlog.data._id));
    } catch (e) {
      console.log(e.response);
    }
  };
};

const deleteBlog = (id) => {
  return { type: "DELETE_BLOG", payload: id };
};

export const startEditBlog = ({ id, formData, redirect, resetForm }) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`/api/blogs/${id}`, formData, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(editBlog(response.data));
      resetForm();
      redirect(response.data._id);
    } catch (e) {
      console.log(e);
    }
  };
};

const editBlog = (blog) => {
  return { type: "EDIT_BLOG", payload: blog };
};


export const startChangeBlogStatus = (id, status) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(
        `/api/blogs/${id}/change-status`,
        { status },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      dispatch(editBlog(data));
    } catch (e) {
      console.log(e.response);
    }
  };
};

export const clearBlogs = () => {
  return { type: "CLEAR_BLOGS" };
};
