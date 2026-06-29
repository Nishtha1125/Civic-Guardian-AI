/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared Type Definitions for Civic Guardian AI

export type IssueCategory = 'Road' | 'Water' | 'Streetlight' | 'Waste' | 'Other';

export type ComplaintStatus = 'Pending' | 'Verified' | 'Under Work' | 'Resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  points: number;
}

export interface AIAnalysis {
  issueCategory: IssueCategory;
  issueType: string;
  severity: 'Low' | 'Medium' | 'High';
  priorityScore: number; // 1 to 10
  affectedArea: string;
  suggestedDepartment: string;
  recommendedAction: string;
  riskAssessment: {
    riskLevel: 'Low' | 'Medium' | 'High';
    explanation: string;
  };
}

export interface Complaint {
  id: string;
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
  createdAt: string;
  aiAnalysis?: AIAnalysis;
  updates: StatusHistory[];
}

export interface StatusHistory {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  message: string;
  timestamp: string;
  updatedBy: 'System' | 'Admin' | 'Gemini AI';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
