const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    roles: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
})

module.exports = mongoose.model('User', userSchema)