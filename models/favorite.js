// models/favorite.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, { foreignKey: 'userId' });
      Favorite.belongsTo(models.Item, { foreignKey: 'itemId' });
    }
  }

  Favorite.init({
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
    modelName: 'Favorite',
    hooks: {
      afterCreate: async (favorite, options) => {
        const item = await sequelize.models.Item.findByPk(favorite.itemId);
        if (item) {
          item.favorites += 1;
          await item.save();
        }
      },
      afterDestroy: async (favorite, options) => {
        const item = await sequelize.models.Item.findByPk(favorite.itemId);
        if (item) {
          item.favorites -= 1;
          await item.save();
        }
      }
    }
  });

  return Favorite;
};
