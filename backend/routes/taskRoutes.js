const express = require('express')
const router = express.Router();
const taskController = require('../controllers/taskController.js')

router.get('/tasks', taskController.getTasks);

router.post('/addTask', taskController.addTask);

router.post('/editTask', taskController.editTask);

router.delete('/deleteTask', taskController.deleteTask);

module.exports = router;