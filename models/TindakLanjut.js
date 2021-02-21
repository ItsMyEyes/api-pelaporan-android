const sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const TindakLanjut =  sequelize.define('tindak_lanjuts', {
        id: {
            allowNull: false,
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            validate: {
              notNull: true
            }
        },
        foto_tindak_lanjut: {
            allowNull: true,
            type: DataTypes.STRING
        },
        keterangan_tindak_lanjut: {
            allowNull: true,
            type: DataTypes.TEXT
        },
        departement_tindak_lanjut: {
            allowNull: true,
            type: DataTypes.STRING
        },
        pesan_tindak_lanjut: {
            allowNull: true,
            type: DataTypes.TEXT
        },
    });

    TindakLanjut.associate = models => {
        TindakLanjut.belongsTo(models.kecelakaans)
        TindakLanjut.belongsTo(models.unsafetys)
    }
    
    return TindakLanjut;
};