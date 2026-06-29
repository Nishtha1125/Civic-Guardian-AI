/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Complaint, User, StatusHistory, ComplaintStatus } from '../src/types';
import { ComplaintModel, UserModel } from './models';

const DATA_FILE = path.join(process.cwd(), 'data.json');

interface DatabaseSchema {
  users: User[];
  complaints: Complaint[];
}

// Initial mockup data to showcase rich real-world examples
const initialData: DatabaseSchema = {
  users: [
    {
      id: 'usr_1',
      name: 'Jane Citizen',
      email: 'anganejanishtha@gmail.com', // Pre-filled with user email
      location: 'Greenwood District, Sector 4',
      points: 120
    }
  ],
  complaints: [
    {
      id: 'comp_1',
      userId: 'usr_1',
      citizenName: 'Jane Citizen',
      title: 'Massive Pothole near Greenwood Elementary school',
      description: 'There is a deep, water-filled pothole right outside the main gate of the elementary school. It causes cars to swerve dangerously onto the pedestrian walkway to avoid it, putting school children at extreme risk. It has grown larger after the recent rain.',
      imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80',
      location: '124 Greenwood Ave, outside School Gate 1',
      category: 'Road',
      severity: 'High',
      priorityScore: 9,
      department: 'Road Maintenance Dept',
      status: 'Under Work',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      aiAnalysis: {
        issueCategory: 'Road',
        issueType: 'Pothole (Active Hazard)',
        severity: 'High',
        priorityScore: 9,
        affectedArea: 'School Zone & Main Commute Road',
        suggestedDepartment: 'Road Maintenance Dept',
        recommendedAction: 'Cordon off immediately and patch with cold mix within 48 hours. Schedule complete milling and resurfacing.',
        riskAssessment: {
          riskLevel: 'High',
          explanation: 'Located in an active school crossing zone. High risk of vehicle-to-pedestrian collision if cars swerve to avoid, and immediate tire/suspension damage for heavy vehicles.'
        }
      },
      updates: [
        {
          id: 'hist_1_1',
          complaintId: 'comp_1',
          status: 'Pending',
          message: 'Complaint registered by citizen Jane Citizen.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedBy: 'System'
        },
        {
          id: 'hist_1_2',
          complaintId: 'comp_1',
          status: 'Verified',
          message: 'Gemini AI automatically verified and triaged the complaint. Priority Score 9/10 was assigned due to active School Zone safety hazard.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(), // +10 mins
          updatedBy: 'Gemini AI'
        },
        {
          id: 'hist_1_3',
          complaintId: 'comp_1',
          status: 'Under Work',
          message: 'Work order #RO-5526 dispatched to Greenwood Field Repairs Crew. Site inspection scheduled for Monday morning.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          updatedBy: 'Admin'
        }
      ]
    },
    {
      id: 'comp_2',
      userId: 'usr_1',
      citizenName: 'Jane Citizen',
      title: 'Water Leakage from Broken Main Pipe',
      description: 'Potable water is gushing out of a fractured underground main pipe. The sidewalk is completely flooded and water has started pooling near local electrical junction boxes. Hundreds of gallons are being wasted.',
      imageUrl: 'https://images.unsplash.com/photo-1542013936693-8848e5744430?auto=format&fit=crop&w=800&q=80',
      location: 'Intersections of Maple St. and Oak Blvd.',
      category: 'Water',
      severity: 'High',
      priorityScore: 8,
      department: 'Water & Sanitation Dept',
      status: 'Pending',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      aiAnalysis: {
        issueCategory: 'Water',
        issueType: 'Main Water Line Rupture',
        severity: 'High',
        priorityScore: 8,
        affectedArea: 'Public Sidewalk & Commercial Sector',
        suggestedDepartment: 'Water & Sanitation Dept',
        recommendedAction: 'Shut off the localized valve immediately to prevent clean water wastage and block electrical short-circuiting risk.',
        riskAssessment: {
          riskLevel: 'High',
          explanation: 'Wastes massive volumes of treated municipal water. Secondary hazard identified due to flooding proximity to underground electrical conduits.'
        }
      },
      updates: [
        {
          id: 'hist_2_1',
          complaintId: 'comp_2',
          status: 'Pending',
          message: 'Complaint submitted by Jane Citizen. Sent to AI engine for triage.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          updatedBy: 'System'
        }
      ]
    }
  ]
};

// Check if mongoose connection is active & ready
function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// Fallback JSON operations
function getJsonDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading JSON DB file:', error);
    return initialData;
  }
}

function saveJsonDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to JSON DB file:', error);
  }
}

// ============================================================================
// DYNAMIC ADAPTER PATTERN (MONGODB & JSON STORE CO-EXISTENCE)
// ============================================================================

export async function getComplaints(): Promise<Complaint[]> {
  if (isMongoConnected()) {
    try {
      const documents = await ComplaintModel.find().sort({ createdAt: -1 }).lean();
      return documents.map((doc: any) => ({
        id: doc._id.toString(),
        userId: doc.userId,
        citizenName: doc.citizenName,
        title: doc.title,
        description: doc.description,
        imageUrl: doc.imageUrl,
        location: doc.location,
        category: doc.category,
        severity: doc.severity,
        priorityScore: doc.priorityScore,
        department: doc.department,
        status: doc.status,
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt || new Date().toISOString(),
        aiAnalysis: doc.aiAnalysis,
        updates: (doc.updates || []).map((update: any) => ({
          id: update._id ? update._id.toString() : update.id,
          complaintId: update.complaintId,
          status: update.status,
          message: update.message,
          timestamp: update.timestamp instanceof Date ? update.timestamp.toISOString() : update.timestamp || new Date().toISOString(),
          updatedBy: update.updatedBy
        }))
      }));
    } catch (err) {
      console.error('Error fetching from MongoDB, falling back to JSON:', err);
    }
  }
  return getJsonDb().complaints;
}

export async function addComplaint(complaint: Omit<Complaint, 'id' | 'createdAt' | 'updates'>): Promise<Complaint> {
  const createdAtStr = new Date().toISOString();

  if (isMongoConnected()) {
    try {
      const tempId = new mongoose.Types.ObjectId().toString();
      const initialHistory = {
        complaintId: tempId,
        status: 'Pending' as ComplaintStatus,
        message: 'Complaint registered. Queued for AI verification.',
        timestamp: new Date(),
        updatedBy: 'System' as const
      };

      const doc = new ComplaintModel({
        _id: tempId,
        userId: complaint.userId,
        citizenName: complaint.citizenName,
        title: complaint.title,
        description: complaint.description,
        imageUrl: complaint.imageUrl,
        location: complaint.location,
        category: complaint.category,
        severity: complaint.severity,
        priorityScore: complaint.priorityScore,
        department: complaint.department,
        status: 'Pending',
        aiAnalysis: complaint.aiAnalysis,
        updates: [initialHistory]
      });

      const saved = await doc.save();
      
      return {
        id: saved._id.toString(),
        userId: saved.userId,
        citizenName: saved.citizenName,
        title: saved.title,
        description: saved.description,
        imageUrl: saved.imageUrl,
        location: saved.location,
        category: saved.category,
        severity: saved.severity,
        priorityScore: saved.priorityScore,
        department: saved.department,
        status: saved.status,
        createdAt: saved.createdAt.toISOString(),
        aiAnalysis: saved.aiAnalysis,
        updates: saved.updates.map((update: any) => ({
          id: update._id.toString(),
          complaintId: update.complaintId,
          status: update.status,
          message: update.message,
          timestamp: update.timestamp.toISOString(),
          updatedBy: update.updatedBy
        }))
      };
    } catch (err) {
      console.error('Failed to add complaint to MongoDB, saving to JSON fallback:', err);
    }
  }

  // Fallback to JSON Database
  const db = getJsonDb();
  const id = `comp_${Date.now()}`;
  
  const initialHistory: StatusHistory = {
    id: `hist_${id}_1`,
    complaintId: id,
    status: 'Pending',
    message: 'Complaint submitted and queued for verification.',
    timestamp: createdAtStr,
    updatedBy: 'System'
  };

  const newComplaint: Complaint = {
    ...complaint,
    id,
    createdAt: createdAtStr,
    updates: [initialHistory]
  };

  db.complaints.unshift(newComplaint);
  saveJsonDb(db);
  return newComplaint;
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  message: string,
  updatedBy: 'System' | 'Admin' | 'Gemini AI'
): Promise<Complaint | null> {
  const timestampDate = new Date();

  if (isMongoConnected()) {
    try {
      const doc = await (ComplaintModel as any).findById(id);
      if (doc) {
        doc.status = status;
        doc.updates.push({
          complaintId: id,
          status,
          message,
          timestamp: timestampDate,
          updatedBy
        } as any);
        const saved = await doc.save();
        return {
          id: saved._id.toString(),
          userId: saved.userId,
          citizenName: saved.citizenName,
          title: saved.title,
          description: saved.description,
          imageUrl: saved.imageUrl,
          location: saved.location,
          category: saved.category,
          severity: saved.severity,
          priorityScore: saved.priorityScore,
          department: saved.department,
          status: saved.status,
          createdAt: saved.createdAt ? saved.createdAt.toISOString() : new Date().toISOString(),
          aiAnalysis: saved.aiAnalysis,
          updates: saved.updates.map((update: any) => ({
            id: update._id.toString(),
            complaintId: update.complaintId,
            status: update.status,
            message: update.message,
            timestamp: update.timestamp.toISOString(),
            updatedBy: update.updatedBy
          }))
        };
      }
    } catch (err) {
      console.error('Error updating status in MongoDB, using JSON fallback:', err);
    }
  }

  // Fallback to JSON database
  const db = getJsonDb();
  const complaint = db.complaints.find(c => c.id === id);
  if (!complaint) return null;

  complaint.status = status;
  
  const newHistory: StatusHistory = {
    id: `hist_${id}_${Date.now()}`,
    complaintId: id,
    status,
    message,
    timestamp: timestampDate.toISOString(),
    updatedBy
  };

  complaint.updates.push(newHistory);
  saveJsonDb(db);
  return complaint;
}

export async function getUserPoints(userId: string): Promise<number> {
  if (isMongoConnected()) {
    try {
      const user = await (UserModel as any).findOne({ id: userId });
      if (user) return user.points;
    } catch (err) {
      console.error('Error finding user points:', err);
    }
  }
  return 120; // Default fallback points for Greenwood District Jane Citizen
}
