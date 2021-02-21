const sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Unsafety =  sequelize.define('unsafetys', {
        id: {
            allowNull: false,
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            validate: {
              notNull: true
            }
        },
        id_pengawai: {
            allowNull: false,
            type: DataTypes.UUID
        },
        tanggal: {
            allowNull: false,
            type: DataTypes.STRING
        },
        area: {
            allowNull: false,
            type: DataTypes.STRING
        },
        keterangan: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        foto: {
            allowNull: false,
            type: DataTypes.STRING
        },
    });

    Unsafety.associate = models => {
        Unsafety.hasOne(models.tindak_lanjuts)
    }

    return Unsafety;
};