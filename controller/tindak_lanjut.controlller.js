const db = require('../models');
const tanggal = require('../helpers/tanggal')
const imageTools = require('../helpers/foto')

exports.index = async (req,res)  => {
    const itemAll = await db.tindak_lanjuts.findAll({
        include: ['kecelakaan']
    });
    res.status(200).json(itemAll);
}

exports.create = async (req,res) => {
    const { id_laporan, keterangan_tindak_lanjut, foto_tindak_lanjut } = req.body;
    if (id_laporan == '' || keterangan_tindak_lanjut == '' || foto_tindak_lanjut == '' ) {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }

    req.body.foto_tindak_lanjut = imageTools.convertFoto(foto_tindak_lanjut, id_laporan, req.body.requestUpdate)
    req.body.tanggal = tanggal.now()
    if (req.body.requestUpdate == 'kecelakaan') {
        const success = await db.tindak_lanjuts.findOne({
            where: {
                kecelakaanId: id_laporan
            }
        })
        if (success) {
             success.update(req.body)
             return res.status(201).json({
                 message: 'success'
             })
        } else {
            req.body.kecelakaanId = id_laporan
            db.tindak_lanjuts.create(req.body)
            return res.status(201).json({
                message: 'success'
            })
        }
        
    } else if(req.body.requestUpdate == 'unsafe') {
        const success = await db.tindak_lanjuts.findOne({
            where: {
                unsafetyId: id_laporan
            }
        })
        if (success) {
            success.update(req.body)
            return res.status(201).json({
                message: 'success'
            })
        } else {
            req.body.unsafetyId = id_laporan
            db.tindak_lanjuts.create(req.body)
            return res.status(201).json({
                message: 'success'
            })
        }
        
    }
}

exports.detail = async (req,res) => {
    const detail = await db.tindak_lanjuts.findOne({ where: { id: req.params.id } })

    return res.status(200).json(detail)
}

exports.update = async (req,res) => {
    const { area, keterangan, id_pengawai } = req.body;
    if (area == '' || keterangan == '' || id_pengawai == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    }

    req.body.foto = imageTools.convertFoto(foto, id_pengawai, 'unsafe')
    req.body.tanggal = tanggal.now()
    const success = await db.tindak_lanjuts.update(req.body, {
        where: {
            id: req.params.id
        }
    })

    return res.status(201).json({
        message: 'Success to update unsafe item'
    })
}

exports.delete = (req,res) => {
    db.tindak_lanjuts.destroy({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({
        message: 'Success to delete unsafe item' 
    })
}