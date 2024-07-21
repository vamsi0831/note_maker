const express = require('express')
const mongoose = require('mongoose')
const Note = require('./models/Note')
const User = require('./models/User')
const app = express()
app.use(express.json({extended: true}))
app.use(express.urlencoded())
const port = 4000

mongoose.connect('mongodb://localhost:27017/notesapp', function(error){
  //check for error in intial connection.
  if(!error){
    console.log('Successfully Connected')
  }
});

//Endpoints to server the HTML
app.get('/', (req, res) => {
  res.sendFile("pages/index.html", {root: __dirname})
})

app.get('/login', (req, res) => {
  res.sendFile("pages/login.html", {root: __dirname})
})

app.get('/signup', (req, res) => {
  res.sendFile("pages/signup.html", {root: __dirname})
})
//Endpoints for APIs
app.post('/getnotes', async (req, res) => {
  let notes = await Note.find({email: req.body.email})
  res.status(200).json({success: true, notes})
})

app.post('/login', async (req, res) => {
  let user = await User.findOne(req.body)
  if(!user){
    res.status(200).json({success: false, message: "No User Found"})
  }
  else{
    res.status(200).json({success: true, user: {email: user.email}, message: "User Found"})
  }
})

app.post('/signup', async (req, res) => {
  const {userToken} = req.body
  // console.log(req.body)
  let user = await User.create(req.body)
  res.status(200).json({success:true, user: user})
})

app.post('/addnote', async (req, res) => {
  const {userToken} = req.body
  let note = await Note.create(req.body)
  res.status(200).json({success:true, note})
})

app.post('/deletenote', (req, res) => {
  const {userToken} = req.body
  res.sendFile("pages/signup.html", {root: __dirname})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})