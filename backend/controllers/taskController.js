const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const User = require('../models/userModel');

//add
router.post("/addTask", async (req, res) => {
    try {
      const { title, description, id } = req.body;
      const existingUser = await User.findById(id);
      if (existingUser) {
        const task = new Task({ title, description, user: existingUser });
        await task.save().then(() => res.status(200).json({ task }));
        existingUser.task.push(task);
        existingUser.save();
      }
    } catch (error) {
      console.log(error);
    }
  });


//update
router.put("/updateTask/:id", async (req, res) => {
    try {
      const { title, description } = req.body;
      const task = await Task.findByIdAndUpdate(req.params.id, { title, description });
      task.save().then(() => res.status(200).json({ message: "List Updated" }));
    } catch (error) {
      console.log(error);
    }
  });

//delete
router.delete("/deleteTask/:id", async (req, res) => {
    try {
      const { id } = req.body;
      const existingUser = await User.findByIdAndUpdate(id, {
        $pull: { task: req.params.id },
      });
      if (existingUser) {
        await Task.findByIdAndDelete(req.params.id).then(() =>
          res.status(200).json({ message: "Task Deleted" })
        );
      }
    } catch (error) {
      console.log(error);
    }
  });



//getTska
router.get("/getTasks/:id", async (req, res) => {
    try {
      const task = await Task.find({ user: req.params.id }).sort({
        createdAt: -1,
      });
      if (task.length !== 0) {
        res.status(200).json({ task: task });
      }
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;