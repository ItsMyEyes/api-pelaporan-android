const express = require('express')
const router = express.Router();
const AuthController = require('../controller/auth.controller')
const authorized = require('../middleware/checkAuth')
const UnsafeController = require('../controller/unsafe.controller')

router.get('/',AuthController.index)
router.get('/register',AuthController.registerUser)
router.get('/verify',AuthController.verifyToken)
router.post('/login',AuthController.attemptLogin)


module.exports = router