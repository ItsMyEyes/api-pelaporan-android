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
        pengawai_id: {
            allowNull: true,
            type: DataTypes.UUID,
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
        no_urut: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        npk_laporan_action: {
            allowNull: true,
            type: DataTypes.STRING
        },
        nama_laporan_action: {
            allowNull: true,
            type: DataTypes.STRING
        },
        type: {
            allowNull: true,
            type: DataTypes.STRING
        },
        no_urut: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
    });

    Unsafety.associate = models => {
        Unsafety.hasOne(models.tindak_lanjuts)
        Unsafety.belongsTo(models.users, { as: 'users', foreignKey: 'pengawai_id' })
    }

    return Unsafety;
};