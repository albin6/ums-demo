import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});

export const AdminModel = mongoose.model<IAdminDocument>('Admin', AdminSchema);