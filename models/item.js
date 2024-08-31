// models/item.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      // 关联到User模型
      Item.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'authorUser'
      });

      // 其他关联关系
      Item.belongsToMany(models.User, { through: 'Like', foreignKey: 'itemId', as: 'likedByUsers' });
      Item.belongsToMany(models.User, { through: 'Favorite', foreignKey: 'itemId', as: 'favoritedByUsers' });
    }
  }

  Item.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author cannot be empty'
        }
      }
    },
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    favorites: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tasks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    progress: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.TEXT,
      allowNull: true
    },
    process: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    team: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    funding: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    achievements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 确保这是你的User模型的表名
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Item',
    hooks: {
      beforeValidate: (item, options) => {
        if (!item.title) {
          throw new Error('Title cannot be empty');
        }
        if (!item.author) {
          throw new Error('Author cannot be empty');
        }
      }
    }
  });

  return Item;
};
