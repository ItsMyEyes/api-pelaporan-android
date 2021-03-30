const express = require('express')
const router = express.Router();
const kecelakaanController = require('../controller/kecelakaan.controller')
const authorized = require('../middleware/checkAuth')

router.get('/', authorized.verifyToken, kecelakaanController.index)
router.post('/tanggal', authorized.verifyToken, kecelakaanController.searchTanggal)
router.post('/tanggal2', authorized.verifyToken, kecelakaanController.searchindex)
router.get('/chart', kecelakaanController.countDate)
router.post('/changeDateCount', kecelakaanController.changeDateCount)
router.get('/all', authorized.verifyToken, kecelakaanController.getAll)
router.post('/add', authorized.verifyToken,kecelakaanController.create)
router.get('/:id', authorized.verifyToken,kecelakaanController.detail)
router.put('/:id/update', authorized.verifyToken,kecelakaanController.update)
router.delete('/:id', authorized.verifyToken,kecelakaanController.delete)

module.exports = router