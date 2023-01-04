const Invitation = require('../model/Invitation');
const User = require('../model/User');
class InvitationController {

    async addInvitation(req, res) {
        const newInvitation = new Invitation(req.body);
        try {
            const savedInvitation = await newInvitation.save();
            res.status(201).json(savedInvitation);
        } catch (err) {
            res.status(500).json(err);
        }
    }
    async acceptInvitation(req, res) {
        try {
            const invitationId = req.params.id;
            const invitation = await Invitation.findById(invitationId);
            console.log(invitation);
            const senderInfo = await User.findById(invitation.sender);
            const receiverInfo = await User.findById(invitation.receiver);
            console.log(senderInfo.friends);
            const updatedSenderFriends = [...senderInfo.friends, invitation.receiver];
            const updatedReceiverFriends = [...receiverInfo.friends, invitation.sender];
            const sender = await User.findOneAndUpdate({ _id: invitation.sender }, { friends: updatedSenderFriends });
            console.log(sender);
            const receiver = await User.findOneAndUpdate({ _id: invitation.receiver }, { friends: updatedReceiverFriends });
            console.log(receiver);
            const deleteInvitation = await Invitation.findOneAndDelete(invitationId);
            res.json("thanh cong");
        } catch (err) {
            console.log(err);
        }
    }
    async refuseInvitation(req, res) {
        try {
            const invitationId = req.params.id;
            const deleteInvitation = await Invitation.deleteOne({ _id: invitationId });
            res.json("xoa thanh cong");
        } catch (err) {
            console.error(err);
        }
    }


    async getInvitationById(req, res) {
        try {
            const invitations = await Invitation.find({
                receiver: req.params.id
            });
            res.json(invitations);
        } catch (err) {
            console.log(err);
        }

    }
    async getInvitation(req, res) {
        try {
            const invitationId = req.params.id;
            const invitation = await Invitation.findById(invitationId);
            res.json(invitation);
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = new InvitationController;