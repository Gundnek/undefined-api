const express = require('express');
const router = express.Router();
const { User, Item, Like } = require('../models');
const authMiddleware = require('../middleware/authMiddleware'); // 引入认证中间件

// 点赞或取消赞
router.route('/')
  .post(authMiddleware, async (req, res) => {
    const userId = req.user.id; // 从认证中间件中获取当前用户的ID
    const { itemId } = req.body;

    try {
      // 检查项目是否存在
      const item = await Item.findByPk(itemId);

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      // 检查是否已经点赞
      const existingLike = await Like.findOne({
        where: { userId, itemId }
      });

      if (existingLike) {
        return res.status(400).json({ message: 'Item already liked by the user' });
      }

      // 创建点赞记录
      await Like.create({ userId, itemId });

      res.status(201).json({ message: 'Item liked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  })
  .delete(authMiddleware, async (req, res) => {
    const userId = req.user.id; // 从认证中间件中获取当前用户的ID
    const { itemId } = req.body;

    try {
      // 检查点赞记录是否存在
      const like = await Like.findOne({
        where: { userId, itemId }
      });

      if (!like) {
        return res.status(404).json({ message: 'Like record not found' });
      }

      // 删除点赞记录
      await like.destroy();

      res.status(200).json({ message: 'Item unliked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  });

// 查询用户点赞的项目
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 检查用户是否存在
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 查询用户点赞的项目
    const likedItems = await user.getLikedItems();

    res.status(200).json(likedItems);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

module.exports = router;
