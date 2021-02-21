'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', { 
      id:  Sequelize.DataTypes.UUID,
      nomer_pegawai: Sequelize.DataTypes.STRING,
      nama: Sequelize.DataTypes.STRING,
      unit_kerja: Sequelize.DataTypes.STRING,
      password: Sequelize.DataTypes.TEXT,
      status: Sequelize.DataTypes.STRING,
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
