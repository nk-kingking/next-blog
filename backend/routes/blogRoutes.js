const express = require('express');
const Blog = require('../models/Blog');
const authenticateToken = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate('author', 'email createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching blogs' 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'email createdAt');
    
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching blog' 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and content are required' 
      });
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and content cannot be empty' 
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated properly' 
      });
    }

    const blog = new Blog({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
    });

    await blog.save();
    await blog.populate('author', 'email createdAt');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error creating blog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and content are required' 
      });
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and content cannot be empty' 
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to edit this blog' 
      });
    }

    blog.title = title.trim();
    blog.content = content.trim();
    blog.updatedAt = Date.now();

    await blog.save();
    await blog.populate('author', 'email createdAt');

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error updating blog' 
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to delete this blog' 
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error deleting blog' 
    });
  }
});

module.exports = router;