import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { startLogin } from "../actions/userActions";

export const Login = () => {
  const [serverErrors, setServerErrors] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required *"),
    password: Yup.string().required("Password is required *").min(8),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validationSchema: loginValidationSchema,
    onSubmit: (formData, { resetForm }) => {
      dispatch(startLogin(formData, navigate, resetForm,setServerErrors));
    },
  });
  return (
    <><h2 className="jc">Login</h2>
    <div className="jc">
      <form className="loginForm" onSubmit={formik.handleSubmit}>
        <label>
          Enter email <br />
          <input
            type="text"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </label>
        <div className="inputErrors">
          {formik.errors.email}
        </div>
        <br />
        <label>
          Enter password <br />
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </label>
        <div className="inputErrors">
          {formik.errors.password}
          {serverErrors}
        </div>
        <br />
        <div className="jc">
        <input type="submit" className="loginBtn" value={'Login'}/>
        </div>
        <b>
        New User? <Link to="/register">Register now</Link>
      </b>
      </form>
      
    </div>
    </>
  );
};
