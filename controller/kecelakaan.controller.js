const db = require('../models');
const tanggal = require('../helpers/tanggal')
const fotoConver = require('../helpers/foto')
const getId = require('../helpers/getId')

exports.index = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.kecelakaans.findAll({
        where: {
            id_pengawai: uid
        },
        include: ['tindak_lanjut']
    });
    res.status(200).json(itemAll);
}

exports.create = async (req,res) => {
    const { area, keterangan, foto, id_pengawai, nama_korban, saksi } = req.body;
    if (area == '' || keterangan == '' || foto == '' || id_pengawai == '' || nama_korban == '' || saksi == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }

    req.body.foto = fotoConver.convertFoto(foto, id_pengawai, 'kecelakaan')
    req.body.tanggal = tanggal.formatDate(tanggal.now())
    req.body.jam_kejadian = tanggal.formatTime(tanggal.now());
    const success = await db.kecelakaans.create(req.body)
    db.tindak_lanjuts.create({
        'kecelakaanId' : success.id
    })

    return res.status(201).json(success)
}

exports.detail = async (req,res) => {
    const detail = await db.kecelakaans.findOne({ where: { id: req.params.id }, include: ['tindak_lanjut'] })

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
        const getting = await db.kecelakaans.findOne({
            where: {
                id: req.params.id
            }
        })
        req.body.foto = getting.foto
    } else {
        req.body.foto = fotoConver.convertFoto(foto, id_pengawai, 'kecelakaan')
    }


    req.body.tanggal = tanggal.now()
    const success = await db.kecelakaans.update(req.body, {
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
    db.kecelakaans.destroy({
        where: {
            id: req.params.id,
            id_pengawai: uid
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