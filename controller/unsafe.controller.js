const db = require('../models');
const tanggal = require('../helpers/tanggal')
const imageTools = require('../helpers/foto')
const getId = require('../helpers/getId')

exports.getAll = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.unsafetys.findAll({
        include: ['users','tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC']
    });
    res.status(200).json(itemAll);
}

exports.index = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.unsafetys.findAll({
        where: {
            pengawai_id: uid
        },
        include: ['users','tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC']
    });
    res.status(200).json(itemAll);
}

exports.create = async (req,res) => {
    const { area, keterangan, foto, pengawai_id } = req.body;
    if (area == '' || keterangan == '' || foto == '' || pengawai_id == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }
    req.body.foto = imageTools.convertFoto(foto, pengawai_id, 'unsafe')
    req.body.tanggal = tanggal.formatDate(tanggal.now())
    const success = await db.unsafetys.create(req.body)
    db.tindak_lanjuts.create({
        'unsafetyId' : success.id
    })
    return res.status(201).json(success)
}

exports.detail = async (req,res) => {
    const detail = await db.unsafetys.findOne({ where: { id: req.params.id }, include: ['tindak_lanjut','users'] })

    return res.status(200).json(detail)
}

exports.update = async (req,res) => {
    const { area, keterangan, foto, pengawai_id } = req.body;
    const uid = await getId.verifyToken(req);
    if (area == '' || keterangan == '' || pengawai_id == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }

    if (foto == '') {
        const getting = await db.unsafetys.findOne({
            where: {
                id: req.params.id
            }
        })
        req.body.foto = getting.foto
    } else {
        req.body.foto = fotoConver.convertFoto(foto, pengawai_id, 'unsafe')
    }

    req.body.tanggal = tanggal.formatDate(tanggal.now())
    const success = await db.unsafetys.update(req.body, {
        where: {
            id: req.params.id,
            pengawai_id: uid
        }
    })

    return res.status(201).json({
        message: 'Success to update unsafe item'
    })
}

exports.delete = async (req,res) => {
    const uid = await getId.verifyToken(req);
    db.unsafetys.destroy({
        where: {
            id: req.params.id,
            pengawai_id: uid
        }
    })

    db.tindak_lanjuts.destroy({
        where: {
            unsafetyId: req.params.id
        }
    })

    res.status(200).json({
        message: 'Success to delete unsafe item' 
    })
}