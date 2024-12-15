const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes');
const taskRouter = require('./routes/taskRoutes');
const cors = require('cors');

const app = express();
const port = process.env.port || 5000

  app.use(cors({
      origin: '*', // Allow requests from any origin
    }));
  app.use(express.json());

// Mongo DB connection
mongoose.connect('mongodb://localhost:27017/TaskManagement')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Router
app.use('/', authRouter);
app.use('/', taskRouter);

app.listen(port)
console.log(`Server started on port ${port}`);

module.exports = app;