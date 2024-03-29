const User=require('../models/user-model')
const usernameSchema = {
  notEmpty: {
    errorMessage: "username is required",
  },
};

const passwordSchema = {
  notEmpty: {
    errorMessage: "password is required",
  },
  isLength: {
    options: { min: 8, max: 128 },
    errorMessage: "password should be between 8 - 128 characters",
  },
};

const emailRegisterSchema = {
  notEmpty: {
    errorMessage: "email is required",
  },
  isEmail: {
    errorMessage: "invalid email format",
  },
  custom: {
    options: async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email already registered");
      } else {
        return true;
      }
    },
  },
};

const emailLoginSchema = {
  notEmpty: {
    errorMessage: "email is required",
  },
  isEmail: {
    errorMessage: "invalid email format",
  },
};

const registerSchema = {
  username: usernameSchema,
  email: emailRegisterSchema,
  password: passwordSchema,
};

const loginSchema = {
  email: emailLoginSchema,
  password: passwordSchema,
};



module.exports = { loginSchema, registerSchema };
