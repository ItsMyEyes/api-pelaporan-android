const express = require('express')
const router = express.Router();
const AuthController = require('../controller/auth.controller')
const authorized = require('../middleware/checkAuth')

router.get('/',AuthController.index)
router.post('/register',AuthController.registerUser)
router.get('/verify',AuthController.verifyToken)
router.post('/login',AuthController.attemptLogin)


module.exports = router