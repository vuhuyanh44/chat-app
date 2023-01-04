const express = require('express')
const router = express.Router();

const messageController = require('../controller/MessageController')

router.post('/', messageController.add)
router.get('/:conversationId', messageController.getMess)
router.get('/:conversationId/lastmsg', messageController.getLastMessage)

module.exports = router;