const express = require("express");
const router = express.Router();

const discussion = require("../services/discussion");

router.post("/create-discussion", async (req, res) => {
  const { title, posted_by, content } = req.body;

  if (!title || !posted_by || !content) {
    res.status(400).json({
      error: "one or more field is not filled",
    });
  } else {
    const data = {
      title: title,
      posted_by: posted_by,
      content: content,
    };
    const newDiscussion = await discussion.createDiscussion(data);
    if (newDiscussion) {
      res.status(201).json(newDiscussion);
    } else {
      res.status(400).json(newDiscussion);
    }
  }
});

router.get("/all-discussion", async (req, res, next) => {
  try {
    const discussions = await discussion.getAllDiscussion();
    res.status(201).json(discussions);
  } catch (error) {
    console.log(error);
  }
});

router.get("/single-discussion", async (req, res, next) => {
  try {
    const id = req.query.id;
    const getdiscussion = await discussion.getDiscussionById(id);
    res.status(201).json(getdiscussion);
  } catch (error) {
    console.log(error);
  }
});

router.get("/discussions-by-user", async (req, res, next) => {
  try {
    const id = req.query.user_id;
    const getdiscussions = await discussion.getDiscussionByUserId(id);
    res.status(201).json(getdiscussions);
  } catch (error) {
    console.log(error);
  }
});

router.put("/update-discussion", async (req, res) => {
  try {
    const { discussion_id } = req.query;
    const { title, posted_by, content } = req.body;
    if (!title || !posted_by || !content) {
      res.status(400).json({
        error: "one or more field is not filled",
      });
    } else {
      const data = {
        title: title,
        posted_by: posted_by,
        content: content,
        discussion_id: discussion_id,
      };
      const updateDiscussion = await discussion.updateDiscussionDetails(data);
      if (updateDiscussion) {
        res.status(201).json(updateDiscussion);
      } else {
        res.status(400).json(updateDiscussion);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-discussion", async (req, res) => {
  try {
    const { discussion_id } = req.query;
    const discussions = await discussion.deleteDiscussion(discussion_id);
    res.status(204).json(discussions);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
