const express = require('express')
const router = express.Router();
const authController = require('../controller/authController')



router.post('/sign-up', authController.signup_post);
router.post('/log-in', authController.login_post);

module.exports = router;