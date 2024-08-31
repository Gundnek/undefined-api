// models/user.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 用户之间的关注和被关注关系
      User.belongsToMany(models.User, { through: 'Follow', foreignKey: 'followerId', as: 'following' });
      User.belongsToMany(models.User, { through: 'Follow', foreignKey: 'followingId', as: 'followers' });
      User.hasMany(models.Item, {
        foreignKey: 'userId',
        as: 'createdItems'
      });
      // 用户对项目的喜欢和收藏关系
      User.belongsToMany(models.Item, { through: 'Like', foreignKey: 'userId', as: 'likedItems' });
      User.belongsToMany(models.Item, { through: 'Favorite', foreignKey: 'userId', as: 'favoriteItems' });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 200],
          msg: 'Signature must be less than 200 characters'
        }
      }
    },
    followerCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    followingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeValidate: (user, options) => {
        if (!user.username) {
          throw new Error('Username cannot be empty');
        }
        if (!user.email) {
          throw new Error('Email cannot be empty');
        }
        if (!user.password) {
          throw new Error('Password cannot be empty');
        }
      }
    }
  });

  return User;
};
