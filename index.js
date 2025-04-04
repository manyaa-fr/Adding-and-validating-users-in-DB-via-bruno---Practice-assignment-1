const express = require('express');
const { resolve } = require('path');
const connectToDatabase = require('./db');
const user = require('./schema');
const bcrypt = require ('bcrypt');
require('dotenv').config();

const app = express();
const port = 3010;
const dburi = process.env.DB_URL;

app.use(express.json());
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/signup', async(req,res) => {
  const {username, mail, password} = req.body;

  if (!username || !mail || !password){
    res.status(400).json({message: "All fields are required!"});
  }

  try {
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new user({
      username,
      mail,
      password: hashedPassword
    })

    await newUser.save();

    res.status(201).json({message: "User Registered Successfully!"});

  } catch (error) {
    console.log(error);
    res.status(501).json("Server error. Please try again.");
  }
})

app.listen(port, async() => {
  try {
    await connectToDatabase(dburi);
  console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.log("error connecting", error);
  }
});
