const express = require('express');
const router = express.Router();
// 引入 Article 模型
const { Article } = require('../../models/');
const { Op } = require('sequelize');

// 公共方法：白名单过滤
function filterBody(body, allowedFields) {
  const filtered = {};
  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      filtered[field] = body[field];
    }
  });
  return filtered;
}

/* GET home page. */
// 处理根路径的GET请求
router.get('/', async function(req, res) {
  try {
    const query = req.query;

    const currentPage = parseInt(query.currentPage) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const offset = (currentPage - 1) * pageSize;
    const limit = pageSize;

    const condition = { 
        order: [['id', 'DESC']],
        offset,
        limit,
    };
    
    if (query.title) {   
        condition.where = {
            title: {
                [Op.like]: `%${query.title}%`
            }
        }               
    }
    const { count, rows} = await Article.findAndCountAll(
      condition
    );

    res.json({
      status: true,
      message: '快去玩柚子社',
      data: { articles: rows, paginations: { currentPage, pageSize, total: count } }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '服务器错误',
      data: null,
      errors: [error.message] 
    });
  }
});

router.get('/:id', async function(req, res) {
  try {
    const article = await Article.findByPk(req.params.id);
    if (article) {
      res.json({
        status: true,
        message: '文章详情',
        data: { article }
      });
    } else {
      res.status(404).json({
        status: false,
        message: '文章不存在',
        data: null,
        errors: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '服务器错误',
      data: null,
      errors: [error.message] 
    });
  }
});

router.post('/', async function(req, res) {
  try {
    const allowedFields = ['title', 'content'];
    const filteredBody = filterBody(req.body, allowedFields);
    const article = await Article.create(filteredBody);
    res.json({
      status: true,
      message: '文章创建成功',
      data: { article }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '服务器错误',
      data: null,
      errors: [error.message] 
    });
  }
});

router.put('/:id', async function(req, res) {
  try {
    const allowedFields = ['title', 'content'];
    const filteredBody = filterBody(req.body, allowedFields);
    const article = await Article.findByPk(req.params.id);
    if (article) {
      await article.update(filteredBody);
      res.json({
        status: true,
        message: '文章更新成功',
        data: { article }
      });
    } else {
      res.status(404).json({
        status: false,
        message: '文章不存在',
        data: null,
        errors: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '服务器错误',
      data: null,
      errors: [error.message] 
    });
  }
});

router.delete('/:id', async function(req, res) {
  try {
    const article = await Article.findByPk(req.params.id);
    if (article) {              
      await article.destroy();
      res.json({
        status: true,
        message: '文章删除成功',
        data: null,
      });
    } else {
      res.status(404).json({                
        status: false,                
        message: '文章不存在',                
        data: null,
        errors: [],
      });                
    }                
  } catch (error) {                
    res.status(500).json({                
      status: false,                
      message: '服务器错误',                
      data: null,                
      errors: [error.message]                
    });                
  }                
});                     
// 导出路由模块
module.exports = router;
