// models/follow.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      // 关联关系在 User 模型中定义
    }
  }

  Follow.init({
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Follow',
    hooks: {
      afterCreate: async (follow, options) => {
        const { User } = sequelize.models;
        await User.increment('followerCount', { where: { id: follow.followingId } });
        await User.increment('followingCount', { where: { id: follow.followerId } });
      },
      afterDestroy: async (follow, options) => {
        const { User } = sequelize.models;
        await User.decrement('followerCount', { where: { id: follow.followingId } });
        await User.decrement('followingCount', { where: { id: follow.followerId } });
      }
    }
  });

  return Follow;
};
