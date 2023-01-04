const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    friends: {
        type: Array,
        require: true
    },
    avatarURL: {
        type: String,
        require: true

    }

}, { timestamps: true });
module.exports = mongoose.model("User", UserSchema);