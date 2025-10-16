import mongoose, { Document, Schema } from 'mongoose';

export interface IIdea extends Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ideaSchema = new Schema<IIdea>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IIdea>('Idea', ideaSchema);
