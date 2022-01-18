const fs = require('fs')
// some
// find
const validateUser = async (req, res, next) =>{
    try {
        const {username , password} = req.body;
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const users = JSON.parse(data)
        const isUsernameExists = users.some(user=>user.username===username)
        const isUserExists = users.some(user=>user.username===username && user.password===password)
        if(isUsernameExists && req.method == "POST" && req.url == '/') return next({status:422, message:"username is used"})
        if(isUserExists && req.url == '/login')return res.status(200).send({ message: "login success" });
        next()
    } catch (error) {
        next({status:500, internalMessage:error.message})
    }
}

module.exports = {
    validateUser
}