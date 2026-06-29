/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load env variables
dotenv.config();

import { connectMongoDB } from './server/mongooseConnection';
import { 
  getComplaints, 
  addComplaint, 
  updateComplaintStatus,
  getUserPoints
} from './server/db';
import { Complaint, ComplaintStatus } from './src/types';

const app = express();
const PORT = 3000;

// Set up limits to handle base64 uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Lazy initialize Gemini API client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY is not defined. AI functions will run in simulated mode.');
    }
    ai = new GoogleGenAI({ apiKey: key || 'placeholder-key' });
  }
  return ai;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Get all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaintsList = await getComplaints();
    res.json(complaintsList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve complaints' });
  }
});

// 2. Register a new complaint (Citizen)
app.post('/api/complaints', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      imageUrl, 
      location, 
      category, 
      severity, 
      priorityScore, 
      department, 
      aiAnalysis,
      citizenName
    } = req.body;

    if (!title || !description || !location || !category) {
      return res.status(400).json({ error: 'Title, description, location, and category are required' });
    }

    const complaint = await addComplaint({
      userId: 'usr_1',
      citizenName: citizenName || 'Jane Citizen',
      title,
      description,
      imageUrl,
      location,
      category,
      severity: severity || 'Medium',
      priorityScore: priorityScore || 5,
      department: department || 'General Municipal Administration',
      status: 'Pending',
      aiAnalysis
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
});

// 3. Update status of complaint (Admin)
app.patch('/api/complaints/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    if (!status || !message) {
      return res.status(400).json({ error: 'Status and message are required' });
    }

    const updated = await updateComplaintStatus(id, status as ComplaintStatus, message, 'Admin');
    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update complaint status' });
  }
});

// 4. Gemini AI Analyzer Endpoint
app.post('/api/analyze-issue', async (req, res) => {
  try {
    const { title, description, imageBase64, mimeType } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required for analysis.' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Return highly realistic mock simulation if API Key is not set yet
      console.log('Using simulated fallback analysis due to missing API key.');
      
      const categoryMap: Record<string, { category: any, dept: string, action: string, type: string }> = {
        'road': { category: 'Road', dept: 'Road Maintenance Dept', action: 'Schedule patching and pothole filling.', type: 'Pothole & Surface Damage' },
        'water': { category: 'Water', dept: 'Water & Sanitation Dept', action: 'Inspect and seal localized pipe leak.', type: 'Water Supply Leakage' },
        'streetlight': { category: 'Streetlight', dept: 'Electrical Maintenance Grid', action: 'Replace luminaire or power ballast.', type: 'Faulty Streetlight Unit' },
        'waste': { category: 'Waste', dept: 'Solid Waste Management', action: 'Deploy sanitation truck for debris clearing.', type: 'Illegal Waste Dumping' },
      };

      const word = (title + ' ' + description).toLowerCase();
      let matchedKey = 'road';
      if (word.includes('water') || word.includes('leak') || word.includes('pipe') || word.includes('flood')) matchedKey = 'water';
      else if (word.includes('light') || word.includes('bulb') || word.includes('dark') || word.includes('lamp')) matchedKey = 'streetlight';
      else if (word.includes('garbage') || word.includes('waste') || word.includes('trash') || word.includes('dump')) matchedKey = 'waste';

      const match = categoryMap[matchedKey];

      const simAnalysis = {
        issueCategory: match.category,
        issueType: match.type,
        severity: 'High',
        priorityScore: 8,
        affectedArea: 'Greenwood Local Sector',
        suggestedDepartment: match.dept,
        recommendedAction: match.action,
        riskAssessment: {
          riskLevel: 'Medium',
          explanation: 'If left unresolved, this may exacerbate localized flooding or traffic disruptions especially during upcoming heavy seasonal rainfall.'
        }
      };

      return res.json(simAnalysis);
    }

    const client = getGeminiClient();
    
    // Construct rich prompt
    const prompt = `
You are the Civic Guardian AI Engine, an intelligent civic officer responsible for evaluating public complaints in a smart city.
Please analyze the following public complaint reported by a citizen:

Title: "${title}"
Description: "${description}"

Generate a structured JSON analysis of this civic issue. Your analysis must consider community impact, public safety hazards, and future progressive risks (e.g. wet weather exacerbating a crack into a full pothole, electrical hazard risks, flooding damage).

Return exactly a JSON object matching this schema:
{
  "issueCategory": "Road" | "Water" | "Streetlight" | "Waste" | "Other",
  "issueType": "Specific type of failure (e.g., Pothole, Flooded Sidewalk, Luminaire Burnout, Trash Accumulation)",
  "severity": "Low" | "Medium" | "High",
  "priorityScore": <number from 1 to 10 based on immediate safety hazard, school/hospital zone proximity, and volume of impact>,
  "affectedArea": "Brief description of the impacted neighborhood or sector (e.g., School Walkway, Shopping Corridor, Residential Lane)",
  "suggestedDepartment": "Name of the municipal department responsible (e.g., Road Maintenance Dept, Water & Sanitation Dept, Electrical Maintenance Grid, Solid Waste Management)",
  "recommendedAction": "Actionable instructions for the field dispatch team to repair or mitigate this",
  "riskAssessment": {
    "riskLevel": "Low" | "Medium" | "High",
    "explanation": "Expert risk prediction of how this issue will deteriorate over time if left unattended (e.g. seasonal factors like rain, structural failure)"
  }
}
`;

    const contents: any[] = [prompt];

    if (imageBase64 && mimeType) {
      // Extract clean base64 data without metadata headers
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType
        }
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini AI');
    }

    const result = JSON.parse(responseText.trim());
    res.json(result);

  } catch (error: any) {
    console.error('Error analyzing issue with Gemini API:', error);
    res.status(500).json({ error: 'AI analysis failed: ' + error.message });
  }
});

// 5. AI Civic Chat Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Mock response if key is missing
      const responseText = "Hello! I am your Civic Guardian Assistant. I can help you report issues like potholes, broken streetlights, or water leaks, or explain the status of your existing complaint. How can I help you today?";
      return res.json({ text: responseText });
    }

    const complaintsList = await getComplaints();
    const activeComplaintsText = complaintsList
      .map(c => `- [${c.id}] ${c.title} (${c.category}) | Status: ${c.status} | Priority Score: ${c.priorityScore}/10`)
      .join('\n');

    const client = getGeminiClient();

    // Construct developer instructions / system instructions context
    const systemInstructions = `
You are the Civic Guardian AI Assistant, a friendly, helpful, and highly competent municipal chatbot. 
Your goal is to guide citizens in reporting localized problems (Roads, Water, Streetlights, Waste, etc.), explain current complaint statuses, and answer community-related questions using clear, simple, and encouraging language.

Here are the current civic complaints registered in the district:
${activeComplaintsText || "No active complaints registered yet."}

Guidelines:
1. Always maintain a professional, reassuring, and helpful civic-officer tone.
2. If a user asks about a complaint, search the active list above (reference ID if provided) and explain its status (Pending, Verified, Under Work, Resolved) and history.
3. Encourage citizens to report new problems. Guide them on what information is needed (location, category, and description).
4. Keep answers brief, clear, and highly supportive. Avoid technical or administrative jargon.
`;

    // Map history to Gemini API format
    const contents: any[] = [];
    
    // Add history
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current user turn
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemInstructions,
      }
    });

    res.json({ text: response.text });

  } catch (error: any) {
    console.error('Error in chatbot Assistant:', error);
    res.status(500).json({ error: 'Assistant error: ' + error.message });
  }
});

// 6. Community Statistics & Health Score
app.get('/api/community-stats', async (req, res) => {
  try {
    const complaints = await getComplaints();

    // Default health scores
    const scores: Record<string, { total: number; resolved: number }> = {
      Road: { total: 0, resolved: 0 },
      Water: { total: 0, resolved: 0 },
      Streetlight: { total: 0, resolved: 0 },
      Waste: { total: 0, resolved: 0 },
      Other: { total: 0, resolved: 0 }
    };

    complaints.forEach(c => {
      if (scores[c.category] !== undefined) {
        scores[c.category].total++;
        if (c.status === 'Resolved') {
          scores[c.category].resolved++;
        } else if (c.status === 'Under Work') {
          scores[c.category].resolved += 0.5; // partial credit
        } else if (c.status === 'Verified') {
          scores[c.category].resolved += 0.2;
        }
      }
    });

    const categories = ['Road', 'Water', 'Streetlight', 'Waste', 'Other'];
    const healthScores = categories.map(cat => {
      const stats = scores[cat];
      // Baseline score is 100%. Each open/unresolved issue deducts points based on severity
      let score = 100;
      complaints.filter(c => c.category === cat).forEach(c => {
        if (c.status !== 'Resolved') {
          const deduction = c.severity === 'High' ? 10 : c.severity === 'Medium' ? 5 : 2;
          score -= deduction;
        }
      });
      return {
        category: cat,
        score: Math.max(40, Math.min(100, score)),
        totalCount: stats.total,
        openCount: complaints.filter(c => c.category === cat && c.status !== 'Resolved').length
      };
    });

    const overallScore = Math.round(
      healthScores.reduce((sum, item) => sum + item.score, 0) / healthScores.length
    );

    res.json({
      overallScore,
      healthScores,
      totalComplaints: complaints.length,
      resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
      underWorkComplaints: complaints.filter(c => c.status === 'Under Work').length,
      pendingComplaints: complaints.filter(c => c.status === 'Pending').length,
    });

  } catch (error) {
    console.error('Error generating community stats:', error);
    res.status(500).json({ error: 'Failed to aggregate community metrics' });
  }
});


// ==========================================
// VITE OR STATIC SERVING MIDDLEWARE
// ==========================================

async function startServer() {
  // Connect to MongoDB if MONGODB_URI is provided
  await connectMongoDB();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Civic Guardian AI] Server running on http://localhost:${PORT}`);
  });
}

startServer();
