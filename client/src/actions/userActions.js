import axios from "../config/axios";
import { jwtDecode } from "jwt-decode";
import {
  startGetBlogsType,
} from "./blogActions";
export const startRegister = (userData, navigate, setServerErrors) => {
  return async () => {
    try {
      const { data } = await axios.post("/api/signup", userData);
      console.log(data);
      navigate("/login");
    } catch (e) {
      console.log(e.response);
      setServerErrors(e.response.data);
    }
  };
};

export const startLogin = (userData, navigate, resetForm, setServerErrors) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("/api/login", userData);
      localStorage.setItem("token", data.token);
      dispatch(LogIn(data));
      const { role } = jwtDecode(data.token);
      if (role === "admin") {
        dispatch(startGetUsers());
        dispatch(startGetBlogsType(""));
      } else if (role === "author"||role === "moderator") dispatch(startGetBlogsType(''));
      else dispatch(startGetBlogsType('approved'))
      resetForm();
      navigate("/");
    } catch (e) {
      console.log(e.response);
      setServerErrors(e.response.data);
    }
  };
};

export const LogIn = () => {
  return { type: "LOGIN" };
};
export const Logout = () => {
  return { type: "LOGOUT" };
};

export const startGetUsers = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/users/list", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(setUsers(data));
    } catch (e) {
      console.log(e.response);
    }
  };
};

const setUsers = (users) => {
  return { type: "SET_USERS", payload: users };
};

export const startDeleteUsers = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.delete(`/api/users/${id}/delete`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(filterUsers(data._id));
    } catch (e) {
      console.log(e);
    }
  };
};

const filterUsers = (id) => {
  return { type: "FILTER_USERS", payload: id };
};

export const startChangeRole = (id, role) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.put(
        `/api/users/${id}/change-role`,
        { role },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      dispatch(setUpatedUsers(data));
    } catch (e) {
      console.log(e.response);
    }
  };
};

const setUpatedUsers = (user) => {
  return { type: "ROLE_CHANGE", payload: user };
};
