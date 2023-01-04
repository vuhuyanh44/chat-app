const express = require('express')
const router = express.Router();

const invitationController = require("../controller/InvitationController");

router.get('/:id', invitationController.getInvitationById);
router.post('/add', invitationController.addInvitation);
router.delete("/delete/accept/:id", invitationController.acceptInvitation);
router.delete('/delete/refuse/:id', invitationController.refuseInvitation);
router.get("/test/:id", invitationController.getInvitation);

module.exports = router;