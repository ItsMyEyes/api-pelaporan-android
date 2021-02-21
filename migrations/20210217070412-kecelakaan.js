'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('kecelakaans', { 
      id:  Sequelize.DataTypes.UUID,
      id_pengawai: Sequelize.DataTypes.UUID,
      tanggal: Sequelize.DataTypes.STRING,
      area: Sequelize.DataTypes.STRING,
      nama_korban: Sequelize.DataTypes.STRING,
      jam_kejadian: Sequelize.DataTypes.STRING,
      saksi: Sequelize.DataTypes.STRING,
      keterangan: Sequelize.DataTypes.TEXT,
      foto: Sequelize.DataTypes.STRING,
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
