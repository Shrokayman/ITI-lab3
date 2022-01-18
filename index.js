const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRouter = require('./routers/usersRouter')
const { validateUser } = require("./userHelpers");
const { logRequest } = require('./generalHelpers')
const { v4: uuidv4 } = require("uuid");
// const router = require('./routers/usersRouter')
app.use(bodyParser.json())


/*
https://www.youtube.com/playlist?list=PLdRrBA8IaU3Xp_qy8X-1u-iqeLlDCmR8a




git add .
git commit -m "message"
git push
*/
app.use("/users", userRouter)


app.use(logRequest)


app.use((err, req, res, next) => {
  if (err.status >= 500) {
    console.log(err.internalMessage);
    return res.status(500).send({error:"internal server error"})
  }
  res.status(err.status).send(err.message)
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})