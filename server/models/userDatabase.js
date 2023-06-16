// UserDatabase Document Schema
const mongoose = require('mongoose')
const userDatabase = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reputation: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        required: true,
    },
    creation: {
        type: Date,
        default: () => new Date()
    }
})
module.exports = mongoose.model('userDatabase', userDatabase)