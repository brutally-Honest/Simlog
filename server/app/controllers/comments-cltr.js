const Comment = require("../models/comment-model");
const _=require("lodash")
const {validationResult}=require('express-validator')
const commentsCltr = {};


commentsCltr.all = async (req, res) => {
  try {
    const comments = await Comment.find({blogId:req.params.id}).populate('userId',['username'])
    res.json(comments);
  } catch (e) {
    res.json(e);
  }
};

commentsCltr.create = async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})

  const blogId = req.params.bId;
  const body = _.pick(req.body, ["body"]);
  try {
    const comment = new Comment(body);
    comment.blogId=blogId
    comment.userId=req.user.id
    await comment.save();
    await comment.populate('userId',["username"])
    res.json(comment);
  } catch (e) {
    res.json(e);
  }
};
commentsCltr.update = async (req, res) => {
  const errors =validationResult(req)
  if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})
  const {bId,cId}=req.params
  const body = _.pick(req.body, ["body"]);
  try {
      const comment = await Comment.findOneAndUpdate(
        { _id: cId, blogId: bId, userId: req.user.id },
        body,
        { new: true }
      ).populate('userId',["username"])
      res.json(comment);
  } catch (e) {
    res.json(e);
  }
};
commentsCltr.delete = async (req, res) => {
  const blogId = req.params.bId;
  const commentId = req.params.cId;
  try {

      const comment = await Comment.findOneAndDelete({
        _id: commentId,
        blogId: blogId,
        userId: req.user.id,
      });
      res.json(comment);
  } catch (e) {
    res.json(e);
  }
};


module.exports = commentsCltr;
