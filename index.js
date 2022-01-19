require('dotenv').config()

const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./routers/usersRouter')
const { logRequest } = require('./generalHelpers')
const { v4: uuidv4 } = require("uuid");
const { validateUser } = require("./userHelpers");
var jwt = require('jsonwebtoken');
const serverConfig = require('./serverConfig')
const { auth } = require('./middlewares/auth')
const User = require('./models/User')
require('./mongoConnect')
app.use(bodyParser.json())
app.use("/users", userRouter)

/*
The Complete Node.js Developer Course
NodeJS - The Complete Guide

MongoDb the developer guide
Javascript the wird parts

javascript.info
https://www.linkedin.com/in/motazabuelnasr/

https://www.youtube.com/playlist?list=PLdRrBA8IaU3Xp_qy8X-1u-iqeLlDCmR8a
Fork the project 
git clone {url}
npm i


Create server with the following end points 
POST /users with uuid, unique username 
PATCH /users/id 
GET /users with age filter 
Create Error handler 
POST /users/login /sucess 200 , error:403
GET /users/id   200,   eror:404
DELETE users/id  200,    error:404
complete middleware for validating user
Create Route For users 

Bonus
Edit patch end point to handle the sent data only
If age is not sent return all users

Lab 5: 
user database instead of files
user jwt to authenticate users after login 
check if the user delete/patch/get his own document
check if user who use GET /users is authenticated



git add .
git commit -m "message"
git push
*/




// Show the request 
app.use(logRequest)

// Handlig errors
app.use((err, req, res, next) => {
  if (err.status >= 500) {
    console.log(err.internalMessage);
    return res.status(500).send({ error: "internal server error" })
  }
  res.status(err.status).send(err.message)
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
