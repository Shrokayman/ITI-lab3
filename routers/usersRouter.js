const fs = require("fs");
const { validateUser } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");


// Get user by id
router.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        console.log(id);
        const users = await fs.promises.readFile('./user.json', { encoding: "utf8" })
            .then((data) => JSON.parse(data))

        const newUser = users.filter(user => {
            return user.id == id
        })
        res.status(200).send(newUser)
    }
    catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
})

// Get with age filter and return all users if no age is sent ====== BONUS ======
router.get('/', async (req, res, next) => {
    try {
        const age = Number(req.query.age)
        const users = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        if (!age) {
            return res.send(users)
        }
        const filteredUsers = users.filter(user => user.age === age)
        res.send(filteredUsers)
    } catch (error) {
        next({ status: 500, internalMessage: error.message });
    }

});



// Post register
router.post("/", validateUser, async (req, res, next) => {
    try {
        const { username, age, password } = req.body;
        const data = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        const id = uuidv4();
        data.push({ id, username, age, password });
        await fs.promises.writeFile("./user.json", JSON.stringify(data), {
            encoding: "utf8",
        });
        res.send({ id, message: "sucess" });
    } catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
});


// Post login
router.post("/login", validateUser, (req, res) => {
    res.status(401).send({ error: "failed" })
})


// Patch edit user by id
router.patch("/:id", validateUser, async (req, res, next) => {
    try {
        const id = req.params.id
        var { username, password, age } = req.body
        const users = await fs.promises.readFile('./user.json', { encoding: "utf8" })
            .then((data) => JSON.parse(data))
        const newUsers = users.map(user => {
            if (user.id !== id) return user;
            return {
                username, password, age, id
            }
        })
        await fs.promises.writeFile("./user.json", JSON.stringify(newUsers), (err) => {
            if (!err) return res.status(200).send({ message: "success" })
            res.status(500).send("server error")
        })
        res.status(200).send({ message: "user edited" })
    }
    catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
});


// Delete user by id
router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        console.log(id);
        const users = await fs.promises.readFile('./user.json', { encoding: "utf8" })
            .then((data) => JSON.parse(data))

        const newUsers = users.filter(user => {
            return user.id !== id
        })
        await fs.promises.writeFile("./user.json", JSON.stringify(newUsers), (err) => {
            if (!err) return res.status(200).send({ message: "success" })
            res.status(500).send("server error")
        })
        res.status(200).send({ message: "user deleted" })

    }
    catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
})



module.exports = router;
