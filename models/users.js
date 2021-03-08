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
    
    todo.associate = models => {
      todo.hasOne(models.unsafetys, { as: 'unsafetys',foreignKey: 'pengawai_id' })
      todo.hasOne(models.kecelakaans, { as: 'kecelakaans',foreignKey: 'pengawai_id' })
    }

    return todo;
};