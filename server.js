const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const mongoURI = 'mongodb://localhost:27017/social'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.json());

// Dummy user data
let users = [
  {
    id: 1,
    username: 'john_doe',
    password: 'password123',
    email: 'john@example.com'
  },
  {
    id: 2,
    username: 'jane_smith',
    password: 'password456',
    email: 'jane@example.com'
  }
];

// GET endpoint to retrieve user information
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === userId);

  if (user) {
    res.json({
      username: user.username,
      password: user.password, // Exposing password, not recommended
      email: user.email
    });
  } else {
    res.status(404).send('User not found');
  }
});

// POST endpoint to create a new user
app.post('/users', (req, res) => {
  const { username, password, email } = req.body;
  const newId = users.length ? Math.max(users.map(u => u.id)) + 1 : 1;

  if (!username || !password || !email) {
    return res.status(400).send('Missing required fields');
  }

  const newUser = { id: newId, username, password, email };
  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT endpoint to update an existing user
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { username, password, email } = req.body;
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  const updatedUser = {
    id: userId,
    username: username !== undefined ? username : users[userIndex].username,
    password: password !== undefined ? password : users[userIndex].password,
    email: email !== undefined ? email : users[userIndex].email
  };

  users[userIndex] = updatedUser;
  res.json(updatedUser);
});

// DELETE endpoint to remove a user
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  const deletedUser = users.splice(userIndex, 1);
  res.json(deletedUser[0]);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
