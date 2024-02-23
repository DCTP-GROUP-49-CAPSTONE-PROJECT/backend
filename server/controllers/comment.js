const express = require("express");
const router = express.Router();

const comment = require("../services/comment");

router.post("/create-comment", async (req, res) => {
    const { discussion_id, commented_by, comment_to_add } = req.body;
  
    if (!discussion_id || !commented_by || !comment_to_add) {
      res.status(400).json({
        error: "one or more field is not filled",
      });
    } else {
      const data = {
        discussion_id, 
        commented_by, 
        comment_to_add
      };
      const newComment = await comment.createComment(data);
      if (newComment) {
        res.status(201).json(newComment);
      } else {
        res.status(400).json(newComment);
      }
    }
});

router.get("/all-comment", async (req, res, next) => {
  try {
    const comments = await comment.getAllComment();
    res.status(201).json(comments);
  } catch (error) {
    console.log(error)
  }
})

router.get("/single-comment", async (req,res,next) => {
  try {
    const id = req.query.id
    const getcomment = await comment.getCommentById(id);
    res.status(201).json(getcomment);
  } catch (error) {
    console.log(error)
  }
})

router.get("/comments-by-user", async (req,res,next) => {
  try {
    const id = req.query.user_id
    const getcomments = await comment.getCommentByUserId(id);
    res.status(201).json(getcomments);
  } catch (error) {
    console.log(error)
  }
})

  module.exports = router;