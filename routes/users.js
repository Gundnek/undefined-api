const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { User } = require('../models/');
const { Op } = require('sequelize');
const fs = require('fs').promises; // 引入 fs 模块的 promises 版本
const authMiddleware = require('../middleware/authMiddleware'); // 假设你有一个认证中间件

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars'); // 上传的头像文件保存在 uploads/avatars 目录下
  },
  filename: (req, file, cb) => {
    const userId = req.user.id; // 从认证中间件中获取用户ID
    const ext = path.extname(file.originalname); // 获取文件扩展名
    cb(null, `${userId}${ext}`); // 使用用户ID作为文件名
  }
});

const avatarUpload = multer({ storage: storage });

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
    
    if (query.username) {   
        condition.where = {
            username: {
                [Op.like]: `%${query.username}%`
            }
        }               
    }
    const { count, rows} = await User.findAndCountAll(
      condition
    );

    res.json({
      status: true,
      message: '用户列表',
      data: { users: rows, paginations: { currentPage, pageSize, total: count } }
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
    const { id } = req.params;
    const { username } = req.query; // 添加查询参数

    let user;
    if (username) {
      // 使用模糊搜索查询用户
      user = await User.findOne({
        where: {
          username: {
            [Op.like]: `%${username}%`
          }
        }
      });
    } else {
      // 如果没有提供用户名，则按ID查询用户
      user = await User.findByPk(id);
    }

    if (user) {
      res.json({
        status: true,
        message: '用户详情',
        data: { user }
      });
    } else {
      res.status(404).json({
        status: false,
        message: '用户不存在',
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
    const allowedFields = ['username', 'email', 'password'];
    const filteredBody = filterBody(req.body, allowedFields);

    // 检查邮箱是否已存在
    if (filteredBody.email) {
      const existingUser = await User.findOne({
        where: {
          email: filteredBody.email
        }
      });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: '邮箱已被占用',
          data: null,
          errors: ['邮箱已被占用']
        });
      }
    }

    const user = await User.create(filteredBody);
    res.json({
      status: true,
      message: '用户创建成功',
      data: { user }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({
        status: false,
        message: '邮箱已被占用',
        data: null,
        errors: [error.message]
      });
    } else {
      res.status(500).json({
        status: false,
        message: '服务器错误',
        data: null,
        errors: [error.message]
      });
    }
  }
});

router.put('/', authMiddleware, async function(req, res) {
  try {
    const userId = req.user.id; // 从认证中间件中获取用户ID
    const allowedFields = ['username', 'email', 'password', 'signature'];
    const filteredBody = filterBody(req.body, allowedFields);
    const user = await User.findByPk(userId);

    if (user) {
      // 检查邮箱是否已存在
      if (filteredBody.email && filteredBody.email !== user.email) {
        const existingUser = await User.findOne({
          where: {
            email: filteredBody.email
          }
        });
        if (existingUser) {
          return res.status(400).json({
            status: false,
            message: '邮箱已被占用',
            data: null,
            errors: ['邮箱已被占用']
          });
        }
      }

      await user.update(filteredBody);
      res.json({
        status: true,
        message: '用户更新成功',
        data: { user }
      });
    } else {
      res.status(404).json({
        status: false,
        message: '用户不存在',
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

router.delete('/', authMiddleware, async function(req, res) {
  try {
    const userId = req.user.id; // 从认证中间件中获取用户ID
    const user = await User.findByPk(userId);
    if (user) {              
      await user.destroy();
      res.json({
        status: true,
        message: '用户删除成功',
        data: null,
      });
    } else {
      res.status(404).json({                
        status: false,                
        message: '用户不存在',                
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




// 上传用户头像
router.post('/avatar', authMiddleware, avatarUpload.single('avatar'), async function(req, res) {  
  const userId = req.user.id; // 从认证中间件中获取用户ID
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const filePath = path.join('uploads/avatars', req.file.filename); // 获取文件路径
      user.avatar = filePath; // 更新用户表中的头像路径
      await user.save(); // 保存用户信息
      res.status(200).json({
        status: true,
        message: '头像上传成功',
        data: { user }
      });
    } else {
      res.status(404).json({
        status: false,
        message: '用户不存在',
        data: null,
        errors: ['用户不存在']
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: '服务器错误',
      data: null,
      errors: [error.message]
    });
  }
});

// 更新用户头像
router.put('/avatar', authMiddleware, avatarUpload.single('avatar'), async function(req, res) {  
  const userId = req.user.id; // 从认证中间件中获取用户ID
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const filePath = path.join('uploads/avatars', req.file.filename); // 获取文件路径
      user.avatar = filePath; // 更新用户表中的头像路径
      await user.save(); // 保存用户信息
      res.status(200).json({
        status: true,
        message: '头像更新成功',
        data: { user }
      });
    } else {
      res.status(404).json({
        status: false,
        message: '用户不存在',
        data: null,
        errors: ['用户不存在']
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: '服务器错误',
      data: null,
      errors: [error.message]
    });
  }
});

// 删除用户头像
router.delete('/avatar', authMiddleware, async function(req, res) {
  const userId = req.user.id; // 从认证中间件中获取用户ID
  try {
    const user = await User.findByPk(userId);
    if (user) {
      if (user.avatar) {
        const avatarPath = path.join(__dirname, '..', user.avatar); // 获取头像文件的完整路径
        await fs.unlink(avatarPath); // 删除文件
      }
      user.avatar = null; // 清空用户表中的头像路径
      await user.save(); // 保存用户信息
      res.json({
        status: true,
        message: '头像删除成功',
        data: { user }
      });
    } else {
      res.status(404).json({
        status: false,
        message: '用户不存在',
        data: null,
        errors: ['用户不存在']
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
