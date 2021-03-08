const express = require('express')
const app = express();
const db = require('./models')
const bodyParser = require('body-parser')
const path = require('path')
const env = require('dotenv');
const { promises } = require('fs');

env.config(); 

// app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,from_where');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(bodyParser.json())

app.use('/api/v1/auth',require('./router/auth'))
app.use('/api/v1/unsafe',require('./router/unsafe'))
app.use('/api/v1/kecelakaan',require('./router/kecelakaan'))
app.use('/api/v1/tindak-lanjut',require('./router/tindak_lanjut'))
app.use('/api/v1/users',require('./router/user'))

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 }))
var dir = path.join(__dirname, 'public');
app.use(express.static(dir))

const port = process.env.PORT
db.sequelize.sync().then(() => {
    app.listen(port, () => { console.log("Listen On Port " + port) })
})