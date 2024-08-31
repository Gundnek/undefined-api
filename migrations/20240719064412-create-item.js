'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title cannot be empty'
          }
        }
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Author cannot be empty'
          }
        }
      },
      introduction: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      favorites: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tasks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      progress: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: 'Progress cannot be less than 0'
          },
          max: {
            args: [100],
            msg: 'Progress cannot be more than 100'
          }
        }
      },
      information: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      process: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      team: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      funding: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      achievements: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // 确保这是你的User模型的表名
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Items');
  }
};
