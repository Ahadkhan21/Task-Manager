const Task = require('../models/Task.js')

const taskController = {};

taskController.getTasks = async(req, res) => {
    try{        
        filter = req.query.filter;        
        const result = await Task.find(filter);
        res.status(200).json({result:result, message: 'Successful'});
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Could not find tasks'});
    }
};

taskController.addTask = async(req, res) => {
    try{
        const newTask = new Task({
            title: req.body.data.title,
            status: req.body.data.status,
            dueDate: req.body.data.dueDate,
            email: req.body.data.email
        });
        await newTask.save();
        res.status(200).json({message: 'New task added successfully'});
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Could not add new task'});
    }
};

taskController.editTask = async (req, res) => {
    try {
      const filter = req.body.data.filter;
      const update = req.body.data.update;
      await Task.findOneAndUpdate(filter, update);
      res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Could not update task' });
    }
};

taskController.deleteTask = async (req, res) => {
    try {
      const { filter } = req.body;
      if (!filter || !filter._id) {
        return res.status(400).json({ message: 'Task ID is required' });
      }
      await Task.deleteOne({ _id: filter._id });
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Could not delete task' });
    }
  };


module.exports = taskController;