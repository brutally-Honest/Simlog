import { useDispatch, useSelector } from "react-redux";
import { startCreateBlog, startEditBlog } from "../actions/blogActions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export const BlogForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serverErrors = useSelector((state) => {
    return state.blogs.serverErrors?.response?.data?.errors;
  });
  const { id } = useParams();

  const blog = useSelector((state) => {
    return state.blogs.data.find((e) => e._id === id);
  });

  const blogValidationSchema = Yup.object().shape({
    title: Yup.string().required("Ttile is required *"),
    content: Yup.string().required("Content is required *").min(5),
  });
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema: blogValidationSchema,
    validateOnChange: false,
    onSubmit: (formData, { resetForm }) => {
      const redirect = (id) => {
        navigate(`/blogs/${id}`);
      };
      if (!id) {
        dispatch(startCreateBlog({ formData, redirect, resetForm }));
      } else {
        dispatch(startEditBlog({ id, formData, redirect, resetForm }));
      }
    },
  });

  useEffect(() => {
    if (blog) {
      formik.setFieldValue("title", blog?.title);
      formik.setFieldValue("content", blog?.content);
    }
  }, [blog]);
  return (
    <>
      <h2>BlogForm</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="blogInput">
          <div>Title</div>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
          />
        </div>
        <div className="inputErrors">{formik.errors.title }</div>
        <br />
        <div className="blogTextArea">
          <div>Content</div>
          <textarea
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
          />
        </div>
        <div className="inputErrors">{formik.errors.content}</div>
        <br />
        <input type="submit" value={id?'Update Blog':'Create Blog'} className="blogBtn" />
      </form>
      {serverErrors?.map((e, i) => (
        <li key={i}>{e.msg}</li>
      ))}
    </>
  );
};
