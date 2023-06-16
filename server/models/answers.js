// Answer Document Schema
const mongoose = require('mongoose')

const answersSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    ans_by: {
        type: String,
        require: true
    },
    userID: {
        type: String,
        required: true
    },
    ans_date_time: {
        type: Date,
        default: () => new Date()
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [{type: String}]
})
answersSchema.virtual('url').get(function() {
    return 'posts/answer/' + this._id
})
module.exports = mongoose.model('answers', answersSchema)