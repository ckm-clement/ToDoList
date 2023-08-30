// defines port number that server will listen to, uses environment viarable PORT if defined other default port 8000
const PORT = process.env.PORT ?? 8000;
//imports Express.js framework
const express = require('express');
//mports mongoose library used to interact with mongoDB
const mongoose = require('mongoose');
//imports Todo and User models
const Todo = require('./models/todoModel');
const User = require('./models/userModel');
// imports cors middleware, allow server to respond request from different origins
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//create instance of express application
const app = express();


//use cors middleware, enable cors for all routes, allowing frontend to make request to backend from a diffrent domain
app.use(cors());
app.use(express.json());



//loads environment variables from .env file, use for storing sensitive confiugration information outside codebase
require('dotenv').config();


//fetches mongoDB connection URL
const connectionURL = process.env.MONGO_URL;


//establish connection to mongoDB
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// const todos = [
//     {
//       // MongoDB will automatically generate a unique ID if not provided
//       user_email: "user1@example.com",
//       title: "Task 1",
//       progress: 0,
//       date: new Date("2023-08-07T12:00:00Z"),
//     },
//     {
 
//       user_email: "user2@example.com",
//       title: "Task 2",
//       progress: 50,
//       date: new Date("2023-08-08T09:30:00Z"),
//     },
   
//   ];
//   Todo.insertMany(todos)
//   .then((result) => {
//     console.log(`${result.length} todos inserted successfully`);
//   })
//   .catch((err) => {
//     console.error('Error inserting todos:', err);
//   });


// setups GET route that expects userEmail parameter, queries ToDo model with the provided userEmail parameter to retrieve the rows for the user, retrieved rows are send as a JSON response
app.get('/todos/:user', async (req,res) => {
  
    const {user} = req.params;
    // console.log(user);
    try{
        const todos = await Todo.find({ user: user });
        res.json(todos);
    } catch(err){
        console.error(err);
    }
})


// create a new todo
app.post('/todos', async (req,res) => {
  const {user, title, progress, date,completed} = req.body;
  
  // console.log(user, title, progress,date);
  try{  
    const newTodo = new Todo({
      user,
      title,
      progress,
      date,
      completed
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch(err){
    console.error(err);
  }
})


// edit a todo task
app.put('/todos/:_id',async(req,res)=>{
  const {_id} = req.params;

  const {user, title, progress, date} = req.body
  try{
    const updatedTodo = await Todo.findByIdAndUpdate(
      _id,
      {user,title,progress,date},
      {new:true} 
    );
    if (!updatedTodo){
      return res.status(404).json({error: 'Task not found'});
    }
    res.json(updatedTodo);
  }catch(err){
    console.error(err)
  }
})


// delete a task
app.delete('/todos/:_id', async(req,res) =>{
  const {_id} = req.params;

  try{
    const deletedTodo  = await Todo.findByIdAndDelete(_id);

    if(!deletedTodo) {
      return res.status(404).json({error: 'Task not found' });
    }

    res.json({message: ' Task deleted successfully'});
  }
  catch(err){
    console.error(err);
    res.status(500).json({error:'Server error'});
  }

});


// complete a task

// Update task completed status
app.put('/complete/:_id', async (req, res) => {
  try {
    const task = await Todo.findByIdAndUpdate(
      req.params._id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// signup
app.post('/signup', async (req, res) => {
  const { user, password } = req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ user: user });

    if (existingUser) {
      return res.status(400).json({ detail: 'user already exists' });
    }

    // If user does not exist, proceed with user creation
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      user,
      hashedPassword,
    });

    const token = jwt.sign({ user }, 'secret', { expiresIn: '1hr' });
    const savedUser = await newUser.save();
    res.json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// login
app.post('/login', async(req,res) => {
  const {user, password} = req.body;
  try{
    const users = await User.find({ user: user });
    // console.log(users);
    if (!users || users.length == 0) {
      return res.status(404).json({ detail: 'user does not exist' });
    }

    const found_user = users[0];
    const success = await bcrypt.compare(password,found_user.hashedPassword);
   
    const token = jwt.sign({'user': found_user.user},'secret', {expiresIn:'1hr'});


    if (success){
      // console.log(success);
      res.json({'user' :found_user.user, token})
    }else{
      res.json({detail:"Login failed"});
    }
  }catch(err){
    console.log(err);
  }
});


// starts the Express app
app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));












