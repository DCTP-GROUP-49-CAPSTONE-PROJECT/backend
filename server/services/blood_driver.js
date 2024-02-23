const Drive = require('../models/blood_drive')
const Provider = require('../models/provider')

// creates a new Blood Drive
const createDrive = async ({title, tokenAmount, startDate, endDate, userId}) => {
    try {
        if (!await Provider.findOne({ _id: userId })) {
            return [false, "user does not exists."];
        }
        const drive = new Drive({
            title: title,
            tokenAmount: tokenAmount,
            startDate: startDate,
            endDate: endDate,
            userId: userId
          });
          if (await drive.save()) {
            return [true, drive];
          }
    } catch (error) {
        console.log(error)
    }
}

/* Return Blood Drive with specified id */
const getDriveById = async (id) => {
    const drive = await Drive.findById({_id: id});
    return drive;
};

/* Return Blood Drive with specified id */
const getDriveByUserId = async (id) => {
  const drives = await Drive.find({userId:id})
  return drives;
};
  
/* Return all Blood Drive */
const getAllDrive = async () => {
    return await Drive.find().populate('userId', '-password');
};

// updates user details
const updateDriveDetails = async ({title, tokenAmount, startDate, endDate, userId,driveId}) => {
    try {
        if (!await Drive.findOne({ userId: userId })) {
            return [false, "Unauthorized User."];
        }
      const update = await Drive.updateOne(
        { _id: driveId },
        {
          $set: {
            title: title,
            tokenAmount: tokenAmount,
            startDate: startDate,
            endDate: endDate
          },
        }
      );
  
      if (update.acknowledged) {
        return [
          true,
          "Blood Drive details updated successfully",
          await Drive.findOne({ _id: driveId }),
        ];
      }
      return [false, "an error occured"];
    } catch (error) {
      console.log(error);
    }
  };
  /* Return Blood Drive with specified id */
const deleteDrive = async (id) => {
    const drive = await Drive.deleteOne({_id: id});
    if (drive) {
        return [true,'Blood Drive Deleted'];   
    }
};

module.exports = {
    createDrive,
    updateDriveDetails,
    getDriveById,
    getDriveByUserId,
    getAllDrive,
    deleteDrive,
  };