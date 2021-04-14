const mongoose = require('mongoose')
const keySchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    description : {
        type : String,
        required : false
    },
    expires : {
        type : Date,
        required : true
    },
    secretKey : {
        type: String,
        required : true
    }
})

module.exports = mongoose.model(`Key`, keySchema);