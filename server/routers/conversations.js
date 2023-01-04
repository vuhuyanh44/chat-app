const express = require('express')
const router = express.Router();

const conversationController = require('../controller/ConversationController');


router.get('/:userName', conversationController.getConv1);
router.get('/find/:firstUserName/:secondUserName', conversationController.getConv2);
router.post('/', conversationController.newConv);
router.delete("/delete/:id", conversationController.deleteConversation);
module.exports = router;