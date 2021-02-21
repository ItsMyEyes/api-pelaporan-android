const tanggal = require('./tanggal')
const fs = require('fs')

exports.convertFoto = (fotonya,nama_foto,path) => {
    var  base64Data = ''
    var  checking = fotonya.split(';')
    if (checking[0] == 'data:image/jpg') {
        base64Data = fotonya.replace(/^data:image\/jpg;base64,/, "");
    } else if(checking[0] == 'data:image/png') { 
        base64Data = fotonya.replace(/^data:image\/png;base64,/, "");
    } else {
        base64Data = fotonya
    }
    var dir = `public/${path}/`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    var dir2 = `public/${path}/${tanggal.formatDate(tanggal.now())}`

    if (!fs.existsSync(dir2)){
        fs.mkdirSync(dir2);
    }

    const tempat = `public/${path}/${tanggal.formatDate(tanggal.now())}/${tanggal.formatTime2(tanggal.now())}-${nama_foto}.png`
    fs.writeFile(tempat, base64Data, 'base64', function(err) {
        console.log(err);
    });

    return `${path}/${tanggal.formatDate(tanggal.now())}/${tanggal.formatTime2(tanggal.now())}-${nama_foto}.png`;

}