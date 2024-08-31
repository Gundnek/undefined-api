// routes/item.js
const express = require('express');
const router = express.Router();
const { Item } = require('../models');
const authMiddleware = require('../middleware/authMiddleware'); // 引入认证中间件

// 获取所有项目
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个项目
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新项目
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // 从认证中间件中获取当前用户的ID
    const username = req.user.username; // 从认证中间件中获取当前用户的username

    // 创建新项目时，将userId和username添加到req.body中
    const itemData = {
      ...req.body,
      userId,
      author: username
    };

    const item = await Item.create(itemData);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新项目
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      // 检查当前用户是否是项目的作者
      if (item.userId !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to update this item' });
      }

      await item.update(req.body);
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除项目
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      // 检查当前用户是否是项目的作者
      if (item.userId !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this item' });
      }

      await item.destroy();
      res.json({ message: 'Item deleted' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
