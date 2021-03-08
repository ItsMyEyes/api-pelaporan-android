const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.verifyToken = async (req,res,next) => {
    const tokenHeader = req.header('Authorization');
    if (tokenHeader == null) {
        var errorIni = 'Not authorized! Go back!';
        const status = 400;
        return res.status(status).json({
            message: errorIni,
            status: '403'
        });
    } else {
        const checking = tokenHeader.split(' ');
        if (checking[0] == 'Auth') {
            const token = req.header('Authorization').replace('Auth ', '')
            const verify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(403).json({'message': 'Forbiden Users please go away','code': 403})
                return user;// pass the execution off to whatever request the client intended
            })
            if (verify.uid) {
                const user = await db.users.findOne({
                    where: {
                        id: verify.uid
                    }
                }).then(data => { return (data) ? data.dataValues : '' })
                if (user === null) {
                    var errorIni = 'Not authorized! Go back!';
                    const status = 400;
                    return res.status(status).json({
                        message: errorIni,
                        status: '403'
                    });
                } else {
                    return next();
                }
            }
        } else {
            var errorIni = 'Not authorized! Go back!';
            const status = 400;
            return res.status(status).json({
                message: errorIni,
                status: '403'
            });
        }
    }
}