const Drive = require('../models/blood_drive')
const User = require('../models/user')
const Schedule = require('../models/schedule')

const createSchedule = async ({donor_id, drive_id, provider_id, date, time}) => {
    try {
        const schedule = new Schedule({
            donor_id: donor_id,
            drive_id: drive_id,
            provider_id: provider_id,
            date: date,
            time: time
        });
        if (await schedule.save()) {
            return [true, schedule];
        }
    } catch (error) {
        console.log(error)
    }
}

const getAllSchedules = async () => {
    return await Schedule.find();
}

const getScheduleById = async (id) => {
    const schedule = await Schedule.findById({_id: id});
    return schedule;
}

const getScheduleByUserId = async (id) => {
    const schedules = await Schedule.find({donor_id:id})
    return schedules;
}

const getScheduleByProviderId = async (id) => {
    const schedules = await Schedule.find({provider_id:id})
    return schedules;
}

const updateScheduleDetails = async ({donor_id,drive_id, provider_id, date, time,schedule_id, donorId}) => {
    try {
        if (!await Schedule.findOne({ donor_id: donorId })) {
            return [false, "Unauthorized User."];
        }
      const update = await Schedule.updateOne(
        { _id: schedule_id },
        {
          $set: {
            donor_id: donor_id,
            drive_id: drive_id,
            provider_id: provider_id,
            date: date,
            time: time
          },
        }
      );
  
      if (update.acknowledged) {
        return [
          true,
          "Schedule details updated successfully",
          await Schedule.findOne({ _id: schedule_id }),
        ];
      }
      return [false, "an error occured"];
    } catch (error) {
      console.log(error);
    }
}

const deleteSchedule = async (id) => {
    const schedule = await Schedule.deleteOne({_id: id});
    if (schedule) {
        return [true,'Schedule Deleted'];   
    }
}

const cancelSchedule = async({schedule_id, donor_id}) => {
    try {
        if (!await Schedule.findOne({ donor_id: donor_id, _id:schedule_id })) {
            return [false, "Unauthorized User."];
        }
      const update = await Schedule.updateOne(
        { _id: schedule_id,
            donor_id:donor_id,
        },
        {
          $set: {
            status: "Cancelled"
          },
        }
      );
  
      if (update.acknowledged) {
        return [
            true,
            "Schedule Cancelled successfully",
          ];
          
      }
      return [false, "an error occured"];
    } catch (error) {
      console.log(error);
    }
}

const approveSchedule = async({drive_id, provider_id, donor_id}) => {
    try {
        if (!await Schedule.find({ provider_id: provider_id, drive_id:drive_id })) {
            return [false, "Unauthorized User."];
        }
      const update = await Schedule.updateOne(
        { drive_id: drive_id,
            donor_id:donor_id,
            provider_id:provider_id
        },
        {
          $set: {
            status: "Approved"
          },
        }
      );
  
      if (update.acknowledged) {
        const updateCancel = await Schedule.updateMany(
            { drive_id: drive_id,
                donor_id:{ $ne: donor_id},
                provider_id:provider_id
            },
            {
              $set: {
                status: "Rejected"
              },
            }
          );
          if(updateCancel.acknowledged){
            return [
              true,
              "Schedule approved successfully",
            ];
          }
      }
      return [false, "an error occured"];
    } catch (error) {
      console.log(error);
    }
}

module.exports = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    getScheduleByUserId,
    getScheduleByProviderId,
    updateScheduleDetails,
    deleteSchedule,
    approveSchedule,    
    cancelSchedule
}