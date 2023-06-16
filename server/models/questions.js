// Question Document Schema
const mongoose = require('mongoose')
var Schema = mongoose.Schema;
const questionsSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    summary: {
        type: String,
    },
    userID: {
        type: String,
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [{type: String}],
    tags: [{type: Schema.Types.ObjectId, ref: 'tags'}],
    answers: [{type: Schema.Types.ObjectId, ref: 'answers'}],
    asked_by: {
        type: String,
        default: 'Anonymous',
        maxlength: 15
    },
    ask_date_time: {
        type: Date,
        default: () => new Date()
    },
    views: {
        type: Number,
        default: 0
    },
})
questionsSchema.virtual("url").get(function() {
    return "posts/questions/" + this._id
})

module.exports = mongoose.model('questions', questionsSchema)