const db = require('../models')
const bcrypt = require('bcrypt')

exports.index = async (req,res)  => {

    const users = await db.users.findAll();
    return res.status(200).json(users)

}

exports.create = async (req,res) => {
    const { nomer_pegawai, nama, unit_kerja, password } = req.body
    if (nomer_pegawai == '' || nama == '' || unit_kerja == '' || password == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    } 

    const password_hash = await bcrypt.hash(password, 10);
    

    db.users.create({
        'nomer_pegawai': nomer_pegawai,
        'nama': nama,
        'unit_kerja': unit_kerja,
        'password': password_hash
    })
    .then((data) => { 
        return res.status(201).json({
            'user': data,
        }) 
    })
    .catch(err => {
        return res.status(500).json({
            message: err.message || "Some error occurred while creating the User."
        });
    })
}

exports.detail = async (req,res) => {
    const detail = await db.users.findOne({ where: { id: req.params.id } })

    return res.status(200).json(detail)
}

exports.update = async (req,res) => {
    const { nomer_pegawai, nama, unit_kerja } = req.body
    if (nomer_pegawai == '' || nama == '' || unit_kerja == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    } 

    const data = null
    if (req.body.password == '') {
        const password_hash = await bcrypt.hash(req.body.password, 10);
        const data = {
            'nomer_pegawai': nomer_pegawai,
            'nama': nama,
            'unit_kerja': unit_kerja,
            'password': password_hash
        }
        const success = await db.users.update(data, {
            where: {
                id: req.params.id,
            }
        })
    } else {
        const data = {
            'nomer_pegawai': nomer_pegawai,
            'nama': nama,
            'unit_kerja': unit_kerja,
        }
        const success = await db.users.update(data, {
            where: {
                id: req.params.id,
            }
        })
    }

    return res.status(201).json({
        message: 'Success to update users item'
    })
}

exports.delete = async (req,res) => {
    const user = await db.users.destroy({
        where: {
            id: req.params.id,
        }
    })

    res.status(200).json({
        message: 'Success to delete unsafe item' ,
    })
}

