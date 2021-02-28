const express = require('express')
const router = express.Router();
const UserController = require('../controller/user.controller')
const authorized = require('../middleware/checkAuth')

router.get('/', authorized.verifyToken, UserController.index)
router.post('/add', authorized.verifyToken,UserController.create)
router.get('/:id', authorized.verifyToken,UserController.detail)
router.put('/:id/update', authorized.verifyToken,UserController.update)
router.delete('/:id', authorized.verifyToken,UserController.delete)


module.exports = router