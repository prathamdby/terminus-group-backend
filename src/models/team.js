import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  picture: { type: String, required: true },
  linkedinUrl: { type: String, required: true }
}, { timestamps: true });

export const Team = mongoose.model('Team', teamSchema);