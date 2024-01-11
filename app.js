const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  cur_best_time: String,
  avg5: String,
  avg10: String,
});

const UserModel = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.static('public'));

// Serve signup.html
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// Handle signup form submission
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password before storing it
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Sign-up successful!' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Serve login.html
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = { username: user.username, email: user.email };

      // Send user data including cur_best_time, avg5, and avg10 to the frontend
      res.status(200).json({
        message: 'Login successful',
        cur_best_time: user.cur_best_time || '',
        avg5: user.avg5 || '',
        avg10: user.avg10 || '',
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Check login status
app.get('/checkLogin', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json({ loggedOut: true });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/updateUserData', async (req, res) => {
  const { cur_best_time, avg5, avg10 } = req.body;

  try {
    await UserModel.updateOne(
      { username: req.session.user.username },
      { cur_best_time, avg5, avg10 }
    );

    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
