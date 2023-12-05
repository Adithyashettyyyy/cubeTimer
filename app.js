const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

const mongoDBURL = process.env.MONGODB_URL;

const connectWithRetry = () => {
  mongoose
    .connect(mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Initial connection attempt
connectWithRetry();

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  rememberMe: Boolean,
});

const User = mongoose.model('User', userSchema);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submitForm', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      rememberMe: req.body['remember-me'] === 'on',
    });

    await newUser.save();

    // Redirect to index.html after successfully saving user data
    res.redirect('/index.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
