'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // 定义数据库迁移的 up 方法，用于创建 Articles 表
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  // 定义数据库迁移的 down 方法，用于删除 Articles 表
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Articles');
  }
};