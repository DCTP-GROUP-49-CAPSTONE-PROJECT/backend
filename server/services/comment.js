const Comment = require('../models/comment')

// creates a new Comment
const createComment = async ({discussion_id, commented_by, comment_to_add}) => {
    try {
        const addcomment = new Comment({
            discussion_id, 
            commented_by, 
            comment:comment_to_add
          });
          if (await addcomment.save()) {
            return [true, addcomment];
          }
    } catch (error) {
        console.log(error)
    }
}

/* Return Comment with specified id */
const getCommentById = async (id) => {
    const comment = await Comment.findById({_id: id});
    return comment;
};

/* Return Comment with specified id */
const getCommentByUserId = async (id) => {
  const comments = await Comment.find({commented_by:id})
  return comments;
};
  
/* Return all Comment */
const getAllComment = async () => {
    return await Comment.find();
};

module.exports = {
    createComment,
    getCommentById,
    getCommentByUserId,
    getAllComment,
  };