// import mongoose library to work with mongoDB
const mongoose = require('mongoose');




// Defines schema for todos collection
const todoSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    maxlength: 30,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


// Create mongoose model toDo
const Todo = mongoose.model('Todo', todoSchema);


// export Todo model
module.exports = Todo;
