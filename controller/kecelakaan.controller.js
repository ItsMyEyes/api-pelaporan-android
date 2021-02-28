const db = require('../models');
const tanggal = require('../helpers/tanggal')
const fotoConver = require('../helpers/foto')
const getId = require('../helpers/getId')

exports.getAll = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.kecelakaans.findAll({
        include: ['tindak_lanjut','users']
    });
    res.status(200).json(itemAll);
}

exports.index = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.kecelakaans.findAll({
        where: {
            pengawai_id: uid
        },
        include: ['tindak_lanjut']
    });
    res.status(200).json(itemAll);
}

exports.create = async (req,res) => {
    const { area, keterangan, foto, pengawai_id, nama_korban, saksi } = req.body;
    if (area == '' || keterangan == '' || foto == '' || pengawai_id == '' || nama_korban == '' || saksi == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }

    req.body.foto = fotoConver.convertFoto(foto, pengawai_id, 'kecelakaan')
    req.body.tanggal = tanggal.formatDate(tanggal.now())
    req.body.jam_kejadian = tanggal.formatTime(tanggal.now());
    const success = await db.kecelakaans.create(req.body)
    db.tindak_lanjuts.create({
        'kecelakaanId' : success.id
    })

    return res.status(201).json(success)
}

exports.detail = async (req,res) => {
    const detail = await db.kecelakaans.findOne({ where: { id: req.params.id }, include: ['tindak_lanjut','users'] })

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
        const getting = await db.kecelakaans.findOne({
            where: {
                id: req.params.id
            }
        })
        req.body.foto = getting.foto
    } else {
        req.body.foto = fotoConver.convertFoto(foto, pengawai_id, 'kecelakaan')
    }

    req.body.tanggal = tanggal.now()
    const success = await db.kecelakaans.update(req.body, {
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
    db.kecelakaans.destroy({
        where: {
            id: req.params.id,
        }
    })
    
    db.tindak_lanjuts.destroy({
        where: {
            kecelakaanId: req.params.id
        }
    })

    res.status(200).json({
        message: 'Success to delete unsafe item' 
    })
}