const { mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: false
    },
    status:{
        type: String,
        required: false
    },
    dueDate:{
        type: Date,
        required: false
    },
    email:{
        type: String,
        required: false,
    },
    timeSpent: { 
        type: Number,
        required: false,
        default: 0 }
})

const Task = mongoose.model('tasks', taskSchema);
module.exports = Task