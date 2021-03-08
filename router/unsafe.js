const express = require('express')
const router = express.Router();
const UnsafeController = require('../controller/unsafe.controller')
const authorized = require('../middleware/checkAuth')

router.get('/', authorized.verifyToken, UnsafeController.index)
router.post('/gen', authorized.verifyToken, UnsafeController.generate)
router.get('/countAll', authorized.verifyToken, UnsafeController.countAll)
router.get('/all', authorized.verifyToken, UnsafeController.getAll)
router.post('/add', authorized.verifyToken,UnsafeController.create)
router.get('/:id', authorized.verifyToken,UnsafeController.detail)
router.put('/:id/update', authorized.verifyToken,UnsafeController.update)
router.delete('/:id', authorized.verifyToken,UnsafeController.delete)


module.exports = router