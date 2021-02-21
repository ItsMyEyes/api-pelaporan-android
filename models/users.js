const sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	const todo =  sequelize.define('users', {
        id: {
            allowNull: false,
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            validate: {
              notNull: true
            }
        },
        nomer_pegawai: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true
        },
        nama: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        unit_kerja: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        password: {
          allowNull: false,
          type: DataTypes.TEXT,
        },
    });
    
    return todo;
};