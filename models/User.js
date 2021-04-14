const mongoose = require('mongoose')
const { Key } = require(`./Key`)

// const keySchema = new mongoose.Schema({
//     name : {
//         type: String,
//         required : true
//     },
//     description : {
//         type : String,
//         required : false
//     },
//     secretKey : {
//         type: String,
//         required : true
//     }
// })

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required: true
    },
    keys : {
        type : [Key],
        required : false
    }
})

module.exports = mongoose.model(`User`, userSchema)
