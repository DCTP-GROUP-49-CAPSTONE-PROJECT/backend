const Drive = require('../models/blood_drive')
const Provider = require('../models/provider')
const User = require('../models/user')
const Discussion = require('../models/discussion')

// creates a new Discussion
const createDiscussion = async ({title, posted_by}) => {
    try {
        const discussion = new Discussion({
            title: title,
            posted_by: posted_by
          });
          if (await discussion.save()) {
            return [true, discussion];
          }
    } catch (error) {
        console.log(error)
    }
}

/* Return Discussion with specified id */
const getDiscussionById = async (id) => {
    const discussion = await Discussion.findById({_id: id});
    return discussion;
};

/* Return Discussion with specified id */
const getDiscussionByUserId = async (id) => {
  const discussions = await Discussion.find({posted_by:id})
  return discussions;
};
  
/* Return all Discussion */
const getAllDiscussion = async () => {
    return await Discussion.find();
};

// updates Discussion details
const updateDiscussionDetails = async ({title, posted_by,discussion_id}) => {
    try {
        if (!await Discussion.findOne({ _id:discussion_id, posted_by: posted_by })) {
            return [false, "Unauthorized User."];
        }
      const update = await Discussion.updateOne(
        { _id: discussion_id},
        {
          $set: {
            title: title,
            posted_by: posted_by
          },
        }
      );
  
      if (update.acknowledged) {
        return [
          true,
          "Discussion details updated successfully",
          await Discussion.findOne({ _id: discussion_id }),
        ];
      }
      return [false, "an error occured"];
    } catch (error) {
      console.log(error);
    }
  };
  /* Delete Discussion with specified id */
const deleteDiscussion = async (id) => {
    const discussion = await Discussion.deleteOne({_id: id});
    if (discussion) {
        return [true,'Discussion Deleted'];   
    }
};

module.exports = {
    createDiscussion,
    updateDiscussionDetails,
    getDiscussionById,
    getDiscussionByUserId,
    getAllDiscussion,
    deleteDiscussion,
  };