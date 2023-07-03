const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Moderator']
    }
},{
    versionKey: false
})


const UserModel = mongoose.model('user', UserSchema);
module.exports = {UserModel};