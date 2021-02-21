const express = require('express')
const router = express.Router();
const AuthController = require('../controller/auth.controller')

router.get('/',AuthController.index)
router.post('/register',AuthController.registerUser)
router.post('/verify',AuthController.verifyToken)
router.post('/login',AuthController.attemptLogin)


module.exports = router