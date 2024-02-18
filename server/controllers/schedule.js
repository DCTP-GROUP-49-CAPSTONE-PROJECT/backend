const express = require("express");
const router = express.Router();

const schedule = require("../services/schedule");

router.post("/create-schedule", async (req, res) => {
    try {
        const { donor_id, drive_id, provider_id, date, time } = req.body;
  
        if (!donor_id || !drive_id || !provider_id || !date || !time) {
            res.status(400).json({
                error: "one or more field is not filled",
            });
        } else {
            const data = {
                donor_id: donor_id,
                drive_id: drive_id,
                provider_id: provider_id,
                date: date,
                time: time
            };
            const newschedule = await schedule.createSchedule(data);
            if (newschedule) {
                res.status(201).json(newschedule);
            } else {
                res.status(400).json(newschedule);
            }
        }
    } catch (error) {
        console.log(error)
    }
});

router.get("/all-schedules", async (req, res, next) => {
  try {
    const schedules = await schedule.getAllSchedules();
    res.status(201).json(schedules);
  } catch (error) {
    console.log(error)
  }
})

router.get("/single-schedule", async (req,res,next) => {
  try {
    const id = req.query.id
    const getschedule = await schedule.getScheduleById(id);
    res.status(201).json(getschedule);
  } catch (error) {
    console.log(error)
  }
})

router.get("/schedules-by-user", async (req,res,next) => {
  try {
    const id = req.query.user_id
    const getschedules = await schedule.getScheduleByUserId(id);
    res.status(201).json(getschedules);
  } catch (error) {
    console.log(error)
  }
})

router.get("/schedules-by-provider", async (req,res,next) => {
    try {
      const id = req.query.provider_id
      const getschedules = await schedule.getScheduleByProviderId(id);
      res.status(201).json(getschedules);
    } catch (error) {
      console.log(error)
    }
  })

router.put("/update-schedule", async (req,res) => {
  try {
    const { schedule_id, donorId } = req.query
    const { drive_id, provider_id, date, time } = req.body;
    if ( !drive_id || !provider_id || !date || !time) {
      res.status(400).json({
        error: "one or more field is not filled",
      });
    }else{
      const data = {
        donor_id: donorId,
        drive_id: drive_id,
        provider_id: provider_id,
        date: date,
        time: time,
        scheduleId: schedule_id,
        donorId: donorId
      };
      const updateschedule = await schedule.updateScheduleDetails(data);
      if (updateschedule) {
        res.status(201).json(updateschedule);
      } else {
        res.status(400).json(updateschedule);
      }
    }
  } catch (error) {
    console.log(error)
  }
})

router.delete("/delete-schedule", async (req, res) => {
  try {
    const { schedule_id } = req.query
    const schedules = await schedule.deleteSchedule(schedule_id);
    res.status(204).json(schedules);
  } catch (error) {
    console.log(error)
  }
})

router.put("/approve-schedule", async (req,res) => {
    try {
      const { drive_id, donor_id, provider_id } = req.query
      if ( !drive_id || !provider_id || !donor_id) {
        res.status(400).json({
          error: "one or more field is not filled",
        });
      }else{
        const data = {
          drive_id: drive_id,
          provider_id: provider_id,
          donor_id: donor_id
        };
        const approveschedule = await schedule.approveSchedule(data);
        if (approveschedule) {
          res.status(201).json(approveschedule);
        } else {
          res.status(400).json(approveschedule);
        }
      }
    } catch (error) {
      console.log(error)
    }
  })

  router.put("/cancel-schedule", async (req,res) => {
    try {
      const { schedule_id, donor_id } = req.query
      if ( !schedule_id  || !donor_id) {
        res.status(400).json({
          error: "one or more field is not filled",
        });
      }else{
        const data = {
          schedule_id: schedule_id,
          donor_id: donor_id
        };
        const cancelschedule = await schedule.cancelSchedule(data);
        if (cancelschedule) {
          res.status(201).json(cancelschedule);
        } else {
          res.status(400).json(cancelschedule);
        }
      }
    } catch (error) {
      console.log(error)
    }
  })

  module.exports = router;