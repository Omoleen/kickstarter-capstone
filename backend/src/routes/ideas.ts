import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Idea from '../models/Idea';
import Comment from '../models/Comment';
import Like from '../models/Like';
import Pledge from '../models/Pledge';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';
import { transformIdea, transformComment } from '../transformers';

const router = express.Router();

// Get all ideas (public route with optional auth for like status)
router.get('/', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?._id;

    // Aggregate ideas with like and pledge counts
    const ideas = await Idea.aggregate([
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'idea',
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'pledges',
          localField: '_id',
          foreignField: 'idea',
          as: 'pledges'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
          likesCount: { $size: '$likes' },
          pledgesCount: { $size: '$pledges' },
          totalPledged: { $sum: '$pledges.amount' },
          isLikedByUser: userId ? {
            $in: [new mongoose.Types.ObjectId(userId.toString()), '$likes.user']
          } : false,
          isPledgedByUser: userId ? {
            $in: [new mongoose.Types.ObjectId(userId.toString()), '$pledges.user']
          } : false
        }
      },
      {
        $project: {
          likes: 0,
          pledges: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    const transformedIdeas = ideas.map(transformIdea);
    res.json(transformedIdeas);
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own ideas (protected route) - must be before /:id route
router.get('/user/my-ideas', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;

    const ideas = await Idea.aggregate([
      {
        $match: { author: new mongoose.Types.ObjectId(userId.toString()) }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'idea',
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'pledges',
          localField: '_id',
          foreignField: 'idea',
          as: 'pledges'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
          likesCount: { $size: '$likes' },
          pledgesCount: { $size: '$pledges' },
          totalPledged: { $sum: '$pledges.amount' },
          isPledgedByUser: userId ? {
            $in: [new mongoose.Types.ObjectId(userId.toString()), '$pledges.user']
          } : false
        }
      },
      {
        $project: {
          likes: 0,
          pledges: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    const transformedIdeas = ideas.map(transformIdea);
    res.json(transformedIdeas);
  } catch (error) {
    console.error('Get user ideas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single idea by ID (public route with optional auth)
router.get('/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user?._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }

    const ideas = await Idea.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(ideaId) }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'idea',
          as: 'likes'
        }
      },
      {
        $lookup: {
          from: 'pledges',
          localField: '_id',
          foreignField: 'idea',
          as: 'pledges'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
          likesCount: { $size: '$likes' },
          pledgesCount: { $size: '$pledges' },
          totalPledged: { $sum: '$pledges.amount' },
          isLikedByUser: userId ? {
            $in: [new mongoose.Types.ObjectId(userId.toString()), '$likes.user']
          } : false,
          isPledgedByUser: userId ? {
            $in: [new mongoose.Types.ObjectId(userId.toString()), '$pledges.user']
          } : false
        }
      },
      {
        $project: {
          likes: 0,
          pledges: 0
        }
      }
    ]);

    if (ideas.length === 0) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const idea = ideas[0];

    // Get comments for this idea
    const comments = await Comment.find({ idea: ideaId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const transformedComments = comments.map(transformComment);
    const ideaWithComments = { ...idea, comments: transformedComments };
    const transformedIdea = transformIdea(ideaWithComments);

    res.json(transformedIdea);
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new idea (protected route)
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('description').trim().isLength({ min: 1, max: 5000 }),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    const idea = new Idea({
      title,
      description,
      author: req.user!._id,
    });

    await idea.save();
    await idea.populate('author', 'name email');

    const ideaObject = idea.toObject() as any;
    ideaObject.likesCount = 0;
    ideaObject.isLikedByUser = false;
    ideaObject.pledgesCount = 0;
    ideaObject.totalPledged = 0;
    ideaObject.isPledgedByUser = false;
    ideaObject.comments = [];

    res.status(201).json({
      message: 'Idea created successfully',
      idea: transformIdea(ideaObject),
    });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike an idea (protected route)
router.post('/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user!._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }

    // Check if idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if user already liked this idea
    const existingLike = await Like.findOne({ user: userId, idea: ideaId });

    if (existingLike) {
      // Unlike - remove the like
      await Like.findByIdAndDelete(existingLike._id);
      
      // Get updated count
      const likesCount = await Like.countDocuments({ idea: ideaId });
      
      res.json({
        message: 'Idea unliked',
        likesCount,
        isLikedByUser: false,
      });
    } else {
      // Like - create new like
      await Like.create({ user: userId, idea: ideaId });
      
      // Get updated count
      const likesCount = await Like.countDocuments({ idea: ideaId });
      
      res.json({
        message: 'Idea liked',
        likesCount,
        isLikedByUser: true,
      });
    }
  } catch (error) {
    console.error('Like idea error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pledge support to an idea (protected route)
router.post('/:id/pledge', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const ideaId = req.params.id;
    const userId = req.user!._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(ideaId)) {
      return res.status(400).json({ message: 'Invalid idea ID' });
    }

    // Check if idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if user already pledged
    const existingPledge = await Pledge.findOne({ user: userId, idea: ideaId });
    if (existingPledge) {
      return res.status(400).json({ message: 'You have already pledged to this idea' });
    }

    // Create pledge (fixed $25 amount as per requirements)
    await Pledge.create({
      user: userId,
      idea: ideaId,
      amount: 25,
    });

    // Get updated counts
    const pledgesCount = await Pledge.countDocuments({ idea: ideaId });
    const pledges = await Pledge.find({ idea: ideaId });
    const totalPledged = pledges.reduce((sum, pledge) => sum + pledge.amount, 0);

    res.json({
      message: 'Pledge added successfully',
      totalPledged,
      pledgesCount,
      isPledgedByUser: true,
    });
  } catch (error) {
    console.error('Pledge idea error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;