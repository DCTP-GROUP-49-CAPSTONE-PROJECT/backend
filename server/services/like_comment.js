const LikeComment = require('../models/like_comment')

// creates a new Comment
const createLikeComment = async ({comment_id, user_id}) => {
    try {
        const user = await LikeComment.findOne({comment_id,user_id})
        if (user) {
            return [false, "User already commented on this discussion"]
        }
        const addlikecomment = new LikeComment({
            comment_id, 
            user_id
          });
          if (await addlikecomment.save()) {
            return [true, addlikecomment];
          }
    } catch (error) {
        console.log(error)
    }
}

/* Return Comment with specified id */
const countLikeCommentById = async (comment_id) => {
    const count = await LikeComment.countDocuments({comment_id});
    return count;
};


module.exports = {
    createLikeComment,
    countLikeCommentById
  };