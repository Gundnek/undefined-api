// models/like.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Like.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
    }
  }

  Like.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Items',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Like',
    hooks: {
      afterCreate: async (like, options) => {
        const item = await sequelize.models.Item.findByPk(like.itemId);
        if (item) {
          item.likes += 1;
          await item.save();
        }
      },
      afterDestroy: async (like, options) => {
        const item = await sequelize.models.Item.findByPk(like.itemId);
        if (item) {
          item.likes -= 1;
          await item.save();
        }
      }
    }
  });

  return Like;
};
