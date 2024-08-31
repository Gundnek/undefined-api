'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // 在这里定义关联关系
    }
  }

  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Article',
    hooks: {
      beforeValidate: (article, options) => {
        if (!article.title || !article.content) {
          throw new Error('Title and content cannot be empty');
        }
      }
    }
  });

  return Article;
};
