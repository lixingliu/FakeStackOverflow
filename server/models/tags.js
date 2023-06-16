// Tag Document Schema
const mongoose = require('mongoose')
const tagsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userID: [{type: String}],
})
tagsSchema.virtual('url').get(function() {
    return "posts/tags/" + this._id
})
module.exports = mongoose.model('tags', tagsSchema)