const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const drive = require("../services/blood_driver");

router.post("/create-blood-drive", async (req, res) => {
  const { title, tokenAmount, startDate, endDate, userId } = req.body;

  if (!title || !tokenAmount || !startDate || !endDate || !userId) {
    res.status(400).json({
      error: "one or more field is not filled",
    });
  } else {
    const data = {
      title: title,
      tokenAmount: tokenAmount,
      startDate: startDate,
      endDate: endDate,
      userId: new mongoose.Types.ObjectId(userId),
    };

    const newDrive = await drive.createDrive(data);
    if (newDrive) {
      res.status(201).json(newDrive);
    } else {
      res.status(400).json(newDrive);
    }
  }
});

router.get("/all-blood-drive", async (req, res, next) => {
  try {
    const drives = await drive.getAllDrive();
    res.status(200).json(drives);
  } catch (error) {
    console.log(error);
  }
});

router.get("/single-blood-drive", async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) {
      res.status(401).json([false, "drive id required"]);
      return;
    }
    const getdrive = await drive.getDriveById(id);
    res.status(200).json(getdrive);
  } catch (error) {
    console.log(error);
  }
});

router.get("/blood-drives-by-user", async (req, res, next) => {
  try {
    const id = req.query.userId;
    if (!id) {
      res.status(401).json([false, "user id required"]);
      return;
    }
    const getdrives = await drive.getDriveByUserId(id);
    res.status(200).json(getdrives);
  } catch (error) {
    console.log(error);
  }
});

router.put("/update-blood-drive", async (req, res) => {
  try {
    const { driveId, userId } = req.query;
    const { title, tokenAmount, startDate, endDate } = req.body;
    if (!title || !tokenAmount || !startDate || !endDate) {
      res.status(400).json({
        error: "one or more field is not filled",
      });
    } else if (!driveId || !userId) {
      res.status(401).json([false, "user id  & drive id required"]);
    } else {
      const data = {
        title: title,
        tokenAmount: tokenAmount,
        startDate: startDate,
        endDate: endDate,
        userId: userId,
        driveId: driveId,
      };
      const updateDrive = await drive.updateDriveDetails(data);
      if (updateDrive) {
        res.status(201).json(updateDrive);
      } else {
        res.status(400).json(updateDrive);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-blood-drive", async (req, res) => {
  try {
    const { driveId } = req.query;
    if (!id) {
      res.status(401).json([false, "drive id required"]);
      return;
    }
    const drives = await drive.deleteDrive(driveId);
    res.status(204).json(drives);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
