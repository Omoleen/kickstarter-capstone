import express, { type Response } from 'express';
import { body, validationResult } from 'express-validator';
import Comment from '../models/Comment.js';
import Idea from '../models/Idea.js';
import { authenticateToken, type AuthRequest } from '../middleware/auth.js';
import { transformComment } from '../transformers/index.js';

const router = express.Router();

// Get comments for a specific idea (public route)
router.get('/idea/:ideaId', async (req, res) => {
  try {
    const comments = await Comment.find({ idea: req.params.ideaId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const transformedComments = comments.map(transformComment);
    res.json(transformedComments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new comment (protected route)
router.post('/', authenticateToken, [
  body('content').trim().isLength({ min: 1, max: 1000 }),
  body('ideaId').isMongoId(),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, ideaId } = req.body;

    // Check if idea exists
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const comment = new Comment({
      content,
      author: req.user!._id,
      idea: ideaId,
    });

    await comment.save();
    await comment.populate('author', 'name email');

    const transformedComment = transformComment(comment.toObject());

    res.status(201).json({
      message: 'Comment created successfully',
      comment: transformedComment,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a comment (protected route - only author can update)
router.put('/:id', authenticateToken, [
  body('content').trim().isLength({ min: 1, max: 1000 }),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if ((comment.author as any).toString() !== (req.user!._id as string).toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'name email');

    const transformedComment = transformComment(comment.toObject());

    res.json({
      message: 'Comment updated successfully',
      comment: transformedComment,
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment (protected route - only author can delete)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if ((comment.author as any).toString() !== (req.user!._id as string).toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
