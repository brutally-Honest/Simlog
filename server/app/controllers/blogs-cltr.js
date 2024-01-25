const Blog = require("../models/blog-model");
const User = require("../models/user-model");
const _ = require("lodash");
const {validationResult}=require('express-validator')

const blogsCltr = {};

blogsCltr.createBlog = async (req, res) => {
  const errors =validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})
  try {
    const fields = _.pick(req.body, ["title", "content"]);
    const blog = new Blog(fields);
    blog.author = req.user.id;
    const savedblog = await blog.save();
    await savedblog.populate('author',["username"])
    res.json(savedblog);
  } catch (e) {
    res.json(e);
  }
};

blogsCltr.updateBlog = async (req, res) => {
  const errors =validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})
  const blogId = req.params.id;
  const fields = _.pick(req.body, ["title", "content"]);
  try {
    if (req.user.role == "author") {
      const blog = await Blog.findOneAndUpdate(
        { _id: blogId, author: req.user.id },
        fields,
        { new: true }
      ).populate('author',["username"]);
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(blogId, fields, { new: true }).populate('author',["username"]);
      res.json(blog);
    }
  } catch (e) {
    res.json(e);
  }
};

blogsCltr.deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    if (req.user.role == "author") {
      const blog = await Blog.findOneAndDelete(
        { _id: blogId, author: req.user.id },
        { new: true }
      );
      blog ? res.json(blog) : res.json("NO record Found");
    } else {
      const blog = await Blog.findByIdAndDelete(blogId, { new: true });
      blog ? res.json(blog) : res.json("NO Record Found");
    }
  } catch (e) {
    res.json(e);
  }
};

blogsCltr.changeStatus = async (req, res) => {
  const id = req.params.id;
  const field = _.pick(req.body, ["status"]);
  try {
    const blog = await Blog.findOneAndUpdate({_id:id,status:'pending'}, field, { new: true });
    res.json(blog);
  } catch (e) {
    res.status(500).json(e)
  }
};

blogsCltr.approved=async (req,res)=>{
  try{
const blog= await Blog.find({status:"approved"}).populate('author',["username"])
res.json(blog)
  }
  catch(e){
    res.status(500).json(e)
  }
}

blogsCltr.type=async(req,res)=>{
 const type=req.query.type
const filterObj=(type==='all'||type==='')?{}:{status:type}
  try{
    const blogType=await Blog.find(filterObj).populate('author',["username"])
    res.json(blogType)
  }
  catch(e){
    res.status(500).json(e)
  }
}
module.exports = blogsCltr;
