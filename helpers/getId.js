const jwt = require('jsonwebtoken')

exports.verifyToken = async (req) => {
    const checking = req.header('Authorization').split(' ');
    console.log(checking[0])
    if (checking[0] == 'Auth') {
        const token = req.header('Authorization').replace('Auth ', '')
        const verify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return err;
            return user;// pass the execution off to whatever request the client intended
        })
        return verify.uid;
    } else {
       return err;
    }
}