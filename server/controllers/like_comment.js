const express = require("express");
const router = express.Router();

const like_comment = require("../services/like_comment");

router.post("/create-like", async (req, res) => {
    const { comment_id, user_id } = req.body;
  
    if (!comment_id || !user_id) {
      res.status(400).json({
        error: "one or more field is not filled",
      });
    } else {
      const data = {
        comment_id, 
        user_id
      };
      const newLike = await like_comment.createLikeComment(data);
      if (newLike) {
        res.status(201).json(newLike);
      } else {
        res.status(400).json(newLike);
      }
    }
});

router.get("/count-like", async (req,res,next) => {
    try {
      const comment_id = req.query.comment_id
      const countlikes = await like_comment.countLikeCommentById(comment_id);
      res.status(200).json(countlikes);
    } catch (error) {
      console.log(error)
    }
  })

  module.exports = router;