const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.index = (req,res) => {
    res.send('Hello World');
}

exports.attemptLogin = async (req,res) => {
    const { nomer_pegawai, password } = req.body
    if (nomer_pegawai == '' || password == '') {
        return res.status(422).json({
            message: 'Required Field',
            code: '422'
        });
    } 

    var userOne = []
    const typeData = req.header('from_where')

    if (typeData) {
        if (typeData == 'Website') {
            userOne = await db.users.findOne({
                where: {
                    nomer_pegawai: nomer_pegawai,
                    unit_kerja: 'admin'
                }
            }).then(data => { return (data) ? data.dataValues : '' })   
        } else if(typeData == 'Android/Apple') {
            userOne = await db.users.findOne({
                where: {
                    nomer_pegawai: nomer_pegawai,
                }
            }).then(data => { return (data) ? data.dataValues : '' })   
        } else {
            userOne = await db.users.findOne({
                where: {
                    nomer_pegawai: nomer_pegawai,
                }
            }).then(data => { return (data) ? data.dataValues : '' })   
        }
        if (userOne) {
            const checkingpassword = await bcrypt.compare(password, userOne.password)
            if (checkingpassword) {
                let payload = { uid: userOne.id }
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
                return res.status(201).json({
                    'user': userOne,
                    'token': accessToken,
                }) 
            } else {
                return res.status(403).json({'message': 'Wrong password or nomer pegawai','code': 403})
            }
        } else {
            return res.status(403).json({'message': 'Forbiden Users please go away','code': 403})
        }
    }
    return res.status(403).json({'message': 'Forbiden Users please go away','code': 403})


}

exports.registerUser = async (req,res)  => {
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

exports.verifyToken = async (req,res) => {
    const checking = req.header('Authorization').split(' ');
    console.log(checking[0])
    if (checking[0] == 'Auth') {
        const token = req.header('Authorization').replace('Auth ', '')
        const verify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({'message': 'Forbiden Users please go away','code': 403})
            return user;// pass the execution off to whatever request the client intended
        })
        const user = await db.users.findOne({
            where: {
                id: verify.uid
            }
        }).then(data => { return (data) ? data.dataValues : '' })
        return res.status(200).send(user);
    } else {
       return res.status(403).json({'message': 'Forbiden Users please go away','code': 403})
    }
}