import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  idea: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  idea: {
    type: Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure one like per user per idea
likeSchema.index({ user: 1, idea: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', likeSchema);