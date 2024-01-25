import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {startRegister} from '../actions/userActions'
export const Register = () => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [role,setRole]=useState('user')
    const [serverErrors,setServerErrors]=useState([])
    const registerValidationSchema=Yup.object().shape({
        username:Yup.string().required("Username is required *"),
        email: Yup.string().email().required("Email is required *"),
        password: Yup.string().required("Password is required *").min(8,'8  Characters minimum*'),
      })
    const formik=useFormik({
        initialValues:{
            username:"",
            email:"",
            password:""
        },
        validateOnChange:false,
        validationSchema:registerValidationSchema,
        onSubmit:(formData)=>{
          formData.role=role
            dispatch(startRegister(formData,navigate,setServerErrors))
        }
    })
  return (
    <div>
      <h2 className="jc">Register</h2>
      <div className="jc">
      <form className="registerForm" onSubmit={formik.handleSubmit}>
        <select value={role} onChange={(e)=>setRole(e.target.value)}>
          <option >Select Role</option>
          <option value={'author'}>Author</option>
          <option value={'user'}>User</option>
        </select>
        <br/>
        <label>
          Username <br />
          <input
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
        </label>{" "}
        <div className="inputErrors">{formik.errors.username}</div>
        <br />
        <label>
          Email <br />
          <input
            type="text"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </label>
        <div className="inputErrors">{formik.errors.email}{serverErrors
            .filter((e) => e.path === "email")
            .map((e, i) => (
              <li key={i}>{e.msg}</li>
            ))}</div>
        <br />
        <label>
          Password <br />
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </label>
        <div className="inputErrors">{formik.errors.password}</div>
        <br />
        <div className="jc">
        <input type="submit" value={'Register'} className="loginBtn"  />
        </div>
      </form>
      </div>
    </div>
  );
};
