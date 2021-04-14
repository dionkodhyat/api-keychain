const router = require('express').Router()
const jwt = require('jsonwebtoken');
const User = require(`../models/User`)
const Key = require(`../models/Key`);
const cors = require('cors')
//Middleware
router.use(require('express').urlencoded())
router.use(require('express').json())



// AUTHENTICATION

// Register
router.post(`/api/register`, async (req, res) => {
    const {username, password} = req.query
    // Check if the user is already in the DB
    const usernameExist = await User.findOne({username: username})
    if (usernameExist) {
        return res.status(400).send('Username already exist')
    }

    // Create a new user
    const user = new User ({
        username : username,
        password: password
    })
    try {
        const savedUser = await user.save();
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Login
router.post('/api/login', async (req, res) => {
    const {username, password} = req.query
    const userExist = await User.findOne({username})
    if (!userExist) {
        res.sendStatus(404)
    }
    jwt.sign({userExist}, 'tokenizer', function(err, token) {
        res.json(token)
    })
})

// Main Menu
router.post(`/api/post`, authenticateToken, (req, res) => {
    jwt.verify(req.token, `tokenizer`, async (err, authData) => {
        if (err) res.sendStatus(400)
        else {
            const user = await User.find({username : authData.userExist.username})
            res.json(user)
        }
    })
})

    

// WORKING WITH KEYS


// Generate secret key
router.post(`/api/generateKey`, authenticateToken, (req, res) => {
    jwt.verify(req.token, 'tokenizer', (err, authData) => {
        if (err)
            res.sendStatus(403)
        // Create secret key
        const {name, description, hours} = req.query
        const username = authData.userExist.username
        const key = jwt.sign({username, name}, 'secretKey', async function(err, secretKey) {
                let expireTime = new Date()
                let hr = hours
                expireTime.setHours(expireTime.getHours() + parseInt(hours))
                expireTime = expireTime.toLocaleString('en-US')
                const userExist = await User.findOne({username, "keys.name" : name})
                if (userExist) return res.status(400).send(`Key name already exist`)
                else {
                    const user = await User.findOneAndUpdate({username}, {"$push": {keys : {name, description, expires : expireTime, secretKey}}}, {new:true})
                    res.send(secretKey)
                }
            })
        })
    })


// Verify secret key
router.post(`/api/verifyKey`, (req, res) => {
    const { token, name } = req.query
    jwt.verify(token, `tokenizer`, async (err, keyData) => {
        if (err) 
            res.send(404)
        else {
            const user = await User.findOne({username: keyData.userExist.username, "keys.name" : name})
            const key = user.keys.find(key => key.name == name)
            if (!key) res.send("Invalid key")
            else {
                let expireDate = convertStringToDate(key.expires)
                if (new Date() > Date.parse(expireDate)) res.send("Key is expired")
                else res.send('Key is valid')
            }
        }
    })
})

// Refresh secret key
router.post(`/api/refreshKey`, authenticateToken, (req, res) => {
    const { token, name, expires } = req.query
    // Authintecate Token
    jwt.verify(token, `tokenizer`, async (err, authData) => {
        if (err) res.send(403)
        else {
            const user = await User.findOne({username : authData.userExist.username, "keys.name" : name})
            const key = user.keys.find(key => key.name == name)
        
            let expire = convertStringToDate(key.expires)
            let newExpire = new Date(expire)
            newExpire.setDate(newExpire.getDate() + 1)
            newExpire = newExpire.toLocaleString('en-US')
            const newUser = await User.findOneAndUpdate({username : authData.userExist.username, "keys.name" : name}, 
                {"$set" : {"keys.$.expires" : newExpire}})
            res.send('Updated')
        }
    })
})


// Update secret key description
router.patch(`/api/updateKey`, authenticateToken, (req, res) => {
    const { name, description }  = req.query
    jwt.verify(req.token, 'tokenizer', async (err, authData) => {
        if (err) 
            res.send(404)
        else {
            //Find user
           const user = await User.findOneAndUpdate({username : authData.userExist.username, "keys.name" : name}, {"$set" : {"keys.$.description" : description}})
           res.send('UPDATED')
        }
    })
})



function authenticateToken(req, res, next) {
    const authHeader = req.query.token
    if (typeof authHeader !== 'undefined') {
        const bearToken = authHeader.split(' ')
        req.token = bearToken[0]
        next()
    } else {
        res.send(403)
    }
}

function convertStringToDate(dateStr) {

    const parts = dateStr.split(',')
    const date = parts[0].split('/')

    let year = date[2]
    let month = date[0]
    let day = date[1]
    month = (parseInt(month) - 1).toString()

    const timeSplit = parts[1].trim().split(' ')
    const timeParts = timeSplit[0].split(':')

    let hours = timeParts[0];
    let minutes = timeParts[1];
    let seconds = timeParts[2];

    if (timeSplit[1]==="PM") {
        hours = parseInt(hours) + 12;
    }

    
    let d = new Date(year, month, day, hours, minutes, seconds)
    return d
}

module.exports = router