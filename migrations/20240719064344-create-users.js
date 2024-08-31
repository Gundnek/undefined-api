'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: 'Username cannot be empty'
          },
          len: {
            args: [1, 50],
            msg: 'Username must be between 1 and 50 characters in length'
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Email cannot be empty'
          },
          isEmail: {
            msg: 'Invalid email format'
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password cannot be empty'
          }
        }
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signature: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0, 200],
            msg: 'Signature must be less than 200 characters'
          }
        }
      },
      followerCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      followingCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
