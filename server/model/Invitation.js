const mongoose = require('mongoose');

const InvitationSchema = mongoose.Schema({
        sender: {
            type: String,
            require: true
        },
        receiver: {
            type: String,
            require: true
        }


    }, { timestamps: true }

);
module.exports = mongoose.model("Invitation", InvitationSchema);