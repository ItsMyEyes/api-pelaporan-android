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
        Unsafety.belongsTo(models.users, { as: 'users', foreignKey: 'pengawai_id' })
    }

    return Unsafety;
};