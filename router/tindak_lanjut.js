const express = require('express')
const router = express.Router();
const tindakLanjut = require('../controller/tindak_lanjut.controlller')
const authorized = require('../middleware/checkAuth')

router.get('/', authorized.verifyToken, tindakLanjut.index)
router.post('/add', authorized.verifyToken,tindakLanjut.create)
router.get('/:id', authorized.verifyToken,tindakLanjut.detail)
router.put('/:id/update', authorized.verifyToken,tindakLanjut.update)
router.delete('/:id', authorized.verifyToken,tindakLanjut.delete)

module.exports = router