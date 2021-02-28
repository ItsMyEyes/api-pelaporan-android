const sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const Kecelakaan =  sequelize.define('kecelakaans', {
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
            allowNull: false,
            type: DataTypes.STRING,
        },
        tanggal: {
            allowNull: false,
            type: DataTypes.STRING
        },
        area: {
            allowNull: false,
            type: DataTypes.STRING
        },
        nama_korban: {
            allowNull: false,
            type: DataTypes.STRING
        },
        jam_kejadian: {
            allowNull: false,
            type: DataTypes.STRING
        },
        saksi: {
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

    Kecelakaan.associate = models => {
        Kecelakaan.hasOne(models.tindak_lanjuts)
        Kecelakaan.belongsTo(models.users, { as: 'users', foreignKey: 'pengawai_id' })
    }
    
    return Kecelakaan;
};