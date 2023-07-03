const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

const BlogModel = mongoose.model('blog', blogSchema);
module.exports = {BlogModel}