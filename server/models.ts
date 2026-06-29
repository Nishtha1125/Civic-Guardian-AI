/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from 'mongoose';
import { IssueCategory, ComplaintStatus } from '../src/types';

// ==========================================
// 1. STATUS HISTORY SCHEMA (Sub-document)
// ==========================================
export interface IStatusHistory extends Document {
  complaintId: string;
  status: ComplaintStatus;
  message: string;
  timestamp: Date;
  updatedBy: 'System' | 'Admin' | 'Gemini AI';
}

const StatusHistorySchema = new Schema<IStatusHistory>({
  complaintId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Under Work', 'Resolved'], 
    required: true 
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { 
    type: String, 
    enum: ['System', 'Admin', 'Gemini AI'], 
    required: true 
  }
});

// ==========================================
// 2. USER SCHEMA & MODEL
// ==========================================
export interface IUser extends Document {
  name: string;
  email: string;
  location: string;
  points: number;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  points: { type: Number, default: 0 }
}, {
  timestamps: true
});

// ==========================================
// 3. COMPLAINT SCHEMA & MODEL
// ==========================================
export interface IComplaint extends Document {
  userId: string;
  citizenName: string;
  title: string;
  description: string;
  imageUrl?: string;
  location: string;
  category: IssueCategory;
  severity: 'Low' | 'Medium' | 'High';
  priorityScore: number;
  department: string;
  status: ComplaintStatus;
  aiAnalysis?: {
    issueCategory: IssueCategory;
    issueType: string;
    severity: 'Low' | 'Medium' | 'High';
    priorityScore: number;
    affectedArea: string;
    suggestedDepartment: string;
    recommendedAction: string;
    riskAssessment: {
      riskLevel: 'Low' | 'Medium' | 'High';
      explanation: string;
    };
  };
  updates: IStatusHistory[];
}

const ComplaintSchema = new Schema<IComplaint>({
  userId: { type: String, required: true },
  citizenName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Road', 'Water', 'Streetlight', 'Waste', 'Other'], 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  priorityScore: { type: Number, min: 1, max: 10, default: 5 },
  department: { type: String, default: 'General Municipal Administration' },
  status: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Under Work', 'Resolved'], 
    default: 'Pending' 
  },
  aiAnalysis: {
    issueCategory: { type: String },
    issueType: { type: String },
    severity: { type: String, enum: ['Low', 'Medium', 'High'] },
    priorityScore: { type: Number },
    affectedArea: { type: String },
    suggestedDepartment: { type: String },
    recommendedAction: { type: String },
    riskAssessment: {
      riskLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
      explanation: { type: String }
    }
  },
  updates: [StatusHistorySchema]
}, {
  timestamps: true
});

// Compile models safely to support hot reloads or multiple imports
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const ComplaintModel = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
