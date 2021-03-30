const db = require('../models');
const tanggal = require('../helpers/tanggal')
const fotoConver = require('../helpers/foto')
const getId = require('../helpers/getId')
const { Op,Sequelize } = require('sequelize')

exports.getAll = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.kecelakaans.findAll({
        include: ['tindak_lanjut','users'],
        where: {
            tanggal: tanggal.formatDate(tanggal.now())
        }
    });
    res.status(200).json(itemAll);
}

exports.countDate = async (req,res) => {
    const time = new Date().toLocaleString("en-us",{ timeZone: "Asia/Jakarta" })
    const d = new Date(time)
    const dateAll = tanggal.getDaysInMonth(d.getMonth(),d.getFullYear());

    unsafe = []
    kecelakaan = []
    tanggal_sebulan = []
    for (let i = 0; i < dateAll.length; i++) {
        const o = await db.unsafetys.findAll({
            include: ['users','tindak_lanjut'],
            orderBy: [ 'tanggal', 'ASC'],
            where: {
                tanggal: tanggal.formatDate(dateAll[i])
            }
        });
        const p = await db.kecelakaans.findAll({
            include: ['users','tindak_lanjut'],
            orderBy: [ 'tanggal', 'ASC'],
            where: {
                tanggal: tanggal.formatDate(dateAll[i])
            }
        });
        kecelakaan.push(p)
        unsafe.push(o)
        tanggal_sebulan.push(dateAll[i])
    }
    
    return res.status(200).json({
        kecelakaan,
        unsafe,
        tanggal_sebulan
    })
}

exports.changeDateCount = async (req,res)  => {
    const p = await db.kecelakaans.findAll({
        include: ['users','tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC'],
        where: {
            tanggal: {
                [Op.between]: [req.body.before, req.body.after]
            }
        }
    });
    res.status(200).json({
        p
    })
}

exports.index = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.kecelakaans.findAll({
        where: {
            pengawai_id: uid,
            tanggal: tanggal.formatDate(tanggal.now)
        },
        include: ['tindak_lanjut']
    });
    res.status(200).json(itemAll);
}

exports.searchindex = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const { tanggal } = req.body;
    if (tanggal == null ) {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }
    const itemAll = await db.kecelakaans.findAll({
        where: {
            pengawai_id: uid,
            tanggal: tanggal
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

    const last = await db.kecelakaans.findOne({ 
        where: { pengawai_id: pengawai_id, tanggal: tanggal.formatDate(tanggal.now()) }, 
        limit: 1
    })

    if (last) {
        req.body.no_urut = last.no_urut + 1
    } else {
        req.body.no_urut = 1
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

exports.searchTanggal = async (req,res)  => {
    const { tanggal_sekarang, tanggal_sampai } = req.body;
    if (tanggal_sekarang == null || tanggal_sampai == null ) {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }
    
    const itemAll = await db.kecelakaans.findAll({
        include: ['users','tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC'],
        where: {
            tanggal: {
                [Op.between]: [tanggal_sekarang, tanggal_sampai]
            }
        }
    });
    return res.status(200).json(itemAll)
}