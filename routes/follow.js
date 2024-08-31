const express = require('express');
const router = express.Router();
const { User, Follow } = require('../models');
const authMiddleware = require('../middleware/authMiddleware'); // 引入认证中间件

// 关注用户
router.post('/', authMiddleware, async (req, res) => {
  const followerId = req.user.id; // 从认证中间件中获取当前用户的ID
  const { followingId } = req.body;
  
  if (followerId === followingId) {
    return res.status(400).send('不能关注自己');
  }

  try {
    // 检查 followingId 是否为有效用户 ID
    const following = await User.findByPk(followingId);
    if (!following) {
      return res.status(400).send('无效的用户 ID');
    }

    // 检查是否已经关注
    const existingFollow = await Follow.findOne({ where: { followerId, followingId } });
    if (existingFollow) {
      return res.status(400).send('已经关注该用户');
    }

    await Follow.create({ followerId, followingId });
    res.status(201).send('关注成功');
  } catch (error) {
    res.status(500).send('服务器错误');
  }
});

// 取消关注用户
router.delete('/', authMiddleware, async (req, res) => {
  const followerId = req.user.id; // 从认证中间件中获取当前用户的ID
  const { followingId } = req.body;

  if (followerId === followingId) {
    return res.status(400).send('不能取消关注自己');
  }

  try {
    // 检查 followingId 是否为有效用户 ID
    const following = await User.findByPk(followingId);
    if (!following) {
      return res.status(400).send('无效的用户 ID');
    }

    // 检查是否已经关注
    const existingFollow = await Follow.findOne({ where: { followerId, followingId } });
    if (!existingFollow) {
      return res.status(400).send('尚未关注该用户');
    }

    await existingFollow.destroy();
    res.status(200).send('取消关注成功');
  } catch (error) {
    res.status(500).send('服务器错误');
  }
});

// 获取用户的关注者
router.get('/:id/followers', async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id, {
      include: [{ 
        model: User, 
        as: 'followers',
        attributes: ['username', 'avatar', 'signature'] // 只包含所需的属性
      }]
    });

    if (!user) {
      return res.status(404).send('用户未找到');
    }

    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).send('服务器错误');
  }
});

// 获取用户关注的用户
router.get('/:id/following', async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id, {
      include: [{ 
        model: User, 
        as: 'following',
        attributes: ['username', 'avatar', 'signature'] // 只包含所需的属性
      }]
    });

    if (!user) {
      return res.status(404).send('用户未找到');
    }

    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).send('服务器错误');
  }
});

module.exports = router;
