const db = require('../models');
const tanggal = require('../helpers/tanggal')
const imageTools = require('../helpers/foto')
const getId = require('../helpers/getId')
const ejs = require("ejs");
const path = require("path");
const pdf = require("html-pdf");

exports.getAll = async (req,res)  => {
    const uid = await getId.verifyToken(req);
    const itemAll = await db.unsafetys.findAll({
        include: ['users','tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC']
    });
    res.status(200).json(itemAll);
}

exports.countAll = async (req,res) => {
    const unsafetyAll = await db.unsafetys.findAll({
        include: ['users','tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC']
    });
    const kecelakaanAll = await db.kecelakaans.findAll({
        include: ['users','tindak_lanjut'],
        orderBy: [ 'tanggal', 'ASC']
    });
    const userAll = await db.users.findAll()
    res.status(200).json({
        unsafety: unsafetyAll.length,
        kecelakaan: kecelakaanAll.length,
        users: userAll.length
    })
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
    const { area, keterangan, foto, pengawai_id, type } = req.body;
    if (area == '' || keterangan == '' || foto == '' || pengawai_id == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }

    const last = await db.unsafetys.findOne({ 
        where: { pengawai_id: pengawai_id, tanggal: tanggal.formatDate(tanggal.now()) }, 
        limit: 1
    })

    if (last) {
        req.body.no_urut = last.no_urut + 1
    } else {
        req.body.no_urut = 1
    }

    if (!req.body.npk_laporan_action) {
        req.body.type = 'action'
    } else {
        req.body.type = 'codition'
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
    db.unsafetys.destroy({
        where: {
            id: req.params.id,
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

exports.generate = async (req,res) => {
    var user = '';
    if (req.body.type == 'kecelakaan') {
        user = await db.kecelakaans.findAll({
            include: ['tindak_lanjut']
        });
    } else if (req.body.type == 'unsafe') {
        user = await db.unsafetys.findAll({
            include: ['tindak_lanjut']
        });
    }
    var assetPath = path.join(__dirname,'../public/')
    assetPath = assetPath.replace(new RegExp(/\\/g),'/');
    ejs.renderFile(path.join(__dirname, '../views/', "report-template.ejs"), {students: user, assetPath: assetPath, name: req.body.type}, (err, data) => {
        if (err) {
            res.json('error view')
        } else {
            let options = {
                "format": "A4",
                "base": "file://"+assetPath,
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile(`public/pdf/report-${tanggal.formatDate(tanggal.now())}-${req.body.type}.pdf`, function (err, data) {
                if (err) {
                    res.json('error create pdf')
                    // return res.json(err);
                } else {
                    console.log('success')
                    return res.json({
                        message: "File Created",
                        link: `report-${tanggal.formatDate(tanggal.now())}-${req.body.type}.pdf`
                    });
                }
            });
        }
    });
}