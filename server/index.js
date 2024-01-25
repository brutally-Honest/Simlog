require("dotenv").config();
const express = require("express");
const {checkSchema}=require('express-validator')
const cors=require('cors')
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const configureDb = require("./config/db");
const usersCltr = require("./app/controllers/users-cltr");
const blogsCltr = require("./app/controllers/blogs-cltr")
const commentsCltr = require("./app/controllers/comments-cltr")
const {
  authenticateUser,
  authorizeUser,
} = require("./app/middlewares/authenticateUser");
const commentSchema=require('./app/helpers/commentValidationsSchema')
const blogValidationSchema = require("./app/helpers/blogValidationSchema");
const {loginSchema,registerSchema}=require('./app/helpers/userValidationSchema')

configureDb();
app.use(cors())

app.post("/api/signup",checkSchema(registerSchema),usersCltr.signup);
app.post("/api/login",checkSchema(loginSchema), usersCltr.login);

app.get("/api/users/list",authenticateUser,authorizeUser(["admin"]),usersCltr.list);
app.put("/api/users/:id/change-role",authenticateUser,authorizeUser(["admin"]),usersCltr.changeRole)
app.delete("/api/users/:id/delete",authenticateUser,authorizeUser(["admin"]),usersCltr.deleteUser)


app.post("/api/blogs",authenticateUser,authorizeUser(["author"]),checkSchema(blogValidationSchema),blogsCltr.createBlog)
app.put("/api/blogs/:id",authenticateUser,authorizeUser(["author","admin"]),checkSchema(blogValidationSchema),blogsCltr.updateBlog)
app.delete("/api/blogs/:id",authenticateUser,authorizeUser(["author","admin"]),blogsCltr.deleteBlog)

app.put("/api/blogs/:id/change-status",authenticateUser,authorizeUser(["moderator"]),blogsCltr.changeStatus)
app.get("/api/blogs",blogsCltr.approved)
app.get('/api/blogs-type',authenticateUser,blogsCltr.type)

app.get("/api/comments/:id",commentsCltr.all)
//nested routes
app.post("/api/blogs/:bId/comments",authenticateUser,authorizeUser(["user","author"]),checkSchema(commentSchema),commentsCltr.create)
app.put("/api/blogs/:bId/comments/:cId",authenticateUser,authorizeUser(["user","author"]),checkSchema(commentSchema),commentsCltr.update)
app.delete("/api/blogs/:bId/comments/:cId",authenticateUser,authorizeUser(["moderator","user","author"]),commentsCltr.delete)

app.listen(port, () => {
  console.log("Server running on port -", port);
});
