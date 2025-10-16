import mongoose, { Document, Schema } from 'mongoose';

export interface IPledge extends Document {
  user: mongoose.Types.ObjectId;
  idea: mongoose.Types.ObjectId;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const pledgeSchema = new Schema<IPledge>({
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
  amount: {
    type: Number,
    required: true,
    default: 25, // Fixed $25 as per MVP requirements
  },
}, {
  timestamps: true,
});

// Ensure one pledge per user per idea (for MVP)
pledgeSchema.index({ user: 1, idea: 1 }, { unique: true });

export default mongoose.model<IPledge>('Pledge', pledgeSchema);