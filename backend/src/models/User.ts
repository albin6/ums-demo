import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: null },
  isBlocked: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);