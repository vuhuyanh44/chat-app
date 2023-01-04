const Conversation = require('../model/Conversation')
const Message = require('../model/Message')
class ConversationController {

    async newConv(req, res) {


            console.log(req.body);
            try {
                const data = req.body;
                const newConversation = new Conversation({ members: data.members, _deleting: false });
                const savedConversation = await newConversation.save();
                console.log(savedConversation);
                const newMessage = new Message({
                    conversationId: savedConversation._id,
                    sender: data.sender,
                    text: data.text
                });
                const savedMessage = await newMessage.save();

                res.status(201).json(savedConversation);

            } catch (err) {
                res.status(500).json(err);
            }

        }
        //get conv of a user
    async getConv1(req, res) {
            try {

                const conversation = await Conversation.find({
                    members: { $in: [req.params.userName] },

                });
                res.status(200).json(conversation);
            } catch (err) {
                res.status(500).json(err);
            }
        }
        // get conv includes two userId
    async getConv2(req, res) {
        try {
            const conversation = await Conversation.findOne({
                members: { $all: [req.params.firstUserName, req.params.secondUserName] },
            });
            res.status(200).json(conversation)
        } catch (err) {
            res.status(500).json(err);
        }
    }
    async deleteConversation(req, res) {
        const id = req.params.id;
        try {
            const conversationUpdateResponse = await Conversation.findOneAndUpdate({ _id: id }, { _deleting: true });
            const conversationResponse = await Conversation.findByIdAndDelete(id);
            console.log(conversationResponse.data);

            const messageResponse = await Message.deleteMany({ conversationId: id });
            console.log(messageResponse.deletedCount);
            res.json(conversationResponse.data)


        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ConversationController;