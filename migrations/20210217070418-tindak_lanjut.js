'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('tindak_lanjuts', { 
      id: Sequelize.DataTypes.UUID, 
      id_laporan: Sequelize.DataTypes.UUID,
      foto_tindak_lanjut: Sequelize.DataTypes.STRING,
      keterangan_tindak_lanjut: Sequelize.DataTypes.TEXT,
      departement_tindak_lanjut: Sequelize.DataTypes.STRING,
      pesan_tindak_lanjut: Sequelize.DataTypes.TEXT,
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
