// import mongoose library to work with mongoDB
const mongoose = require('mongoose');

// define scehma for user schema
const userSchema = new mongoose.Schema({
  user: {
    type: String,
    unique: true,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});


// create model User
const User = mongoose.model('User', userSchema);


// export User model
module.exports = User;
