const db = require('../models');
const tanggal = require('../helpers/tanggal')
const imageTools = require('../helpers/foto')
const getId = require('../helpers/getId')

exports.index = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.unsafetys.findAll({
        where: {
            id_pengawai: uid
        },
        include: ['tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC']
    });
    res.status(200).json(itemAll);
}

exports.create = async (req,res) => {
    const { area, keterangan, foto, id_pengawai } = req.body;
    if (area == '' || keterangan == '' || foto == '' || id_pengawai == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }

    req.body.foto = imageTools.convertFoto(foto, id_pengawai, 'unsafe')
    req.body.tanggal = tanggal.formatDate(tanggal.now())
    const success = await db.unsafetys.create(req.body)
    db.tindak_lanjuts.create({
        'unsafetyId' : success.id
    })
    return res.status(201).json(success)
}

exports.detail = async (req,res) => {
    const detail = await db.unsafetys.findOne({ where: { id: req.params.id }, include: ['tindak_lanjut'] })

    return res.status(200).json(detail)
}

exports.update = async (req,res) => {
    const { area, keterangan, foto, id_pengawai } = req.body;
    const uid = await getId.verifyToken(req);
    if (area == '' || keterangan == '' || id_pengawai == '') {
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
        req.body.foto = fotoConver.convertFoto(foto, id_pengawai, 'unsafe')
    }

    req.body.tanggal = tanggal.formatDate(tanggal.now())
    const success = await db.unsafetys.update(req.body, {
        where: {
            id: req.params.id,
            id_pengawai: uid
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
            id_pengawai: uid
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