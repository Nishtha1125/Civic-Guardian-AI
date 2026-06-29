# Civic Guardian AI 🏛️✨
### *Hyperlocal AI-Powered Civic Intelligence, Risk Prediction, & Automated Municipality Dispatch*

[![Vibe2Ship Hackathon](https://img.shields.io/badge/Hackathon-Vibe2Ship-emerald?style=for-the-badge&logo=google)](https://ai.studio/build)
[![Google Gemini](https://img.shields.io/badge/Powered%20By-Google%20Gemini%25202.5%2520Flash-blue?style=for-the-badge&logo=google-gemini)](https://ai.studio/build)
[![TypeScript](https://img.shields.io/badge/TypeScript-Full--Stack-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Deploy on Cloud Run](https://img.shields.io/badge/Deploy%20To-Google%20Cloud%20Run-teal?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/run)

**Civic Guardian AI** is an intelligent, full-stack civic response system that bridges the gap between proactive citizens and municipal dispatch departments. By leveraging state-of-the-art **Google Gemini 2.5 Flash** models, the application analyzes visual evidence (photos of road cracks, burst water pipes, or faulty streetlights), performs multi-hazard predictive risk assessments, automatically assigns triage priority scores, routes the incident to the appropriate municipal department, and tracks repairs in real-time.

---

## 📌 Problem Statement Selected
### **Hyperlocal Civic Infrastructure Decay & Delayed Dispatch Triage**

In modern municipalities, reporting neighborhood infrastructure failures (such as dangerous potholes in school zones, burst water mains flooding sidewalks, or dark streetlight corridors) is a highly friction-filled process:
1. **Inefficient Manual Sorting**: City admins spend hundreds of hours manually sorting citizen complaints, resulting in dispatch delays.
2. **Lack of Risk Modeling**: Municipalities treat all complaints equally, failing to predict how weather changes (e.g., rains, freezes) will deteriorate a minor issue (like a road crack) into an active, dangerous washout.
3. **Siloed Public Communication**: Citizens file complaints into a black box, receiving no transparency on crew dispatches, live updates, or completion proof.

---

## 💡 Solution Overview: Civic Guardian AI

**Civic Guardian AI** solves this by putting an AI-driven "Assistant Deputy" between citizen-reported media and municipal engineering dispatch:
* **Instant Multimodal Triage**: Citizens upload raw photos and descriptions. Server-side **Gemini 2.5 Flash** instantly acts as a highly trained civic surveyor, classifying the hazard, generating an automatic urgency priority rating (1-10), and routing the task to the responsible ward division (e.g., *Road Maintenance Dept*, *Electrical Grid*).
* **AI Predictive Deterioration Analysis**: Rather than static sorting, the AI analyzes weather-risk progression, warning municipal admins of secondary risks (e.g., "flooding next to high-voltage junction boxes" or "potholes in school walking paths").
* **Fully Transparent Dispatch Logs**: Municipal admins use a central **Command Control Panel** to assign crews, send localized repair memo logs, and update live tickets. Citizens can inspect detailed step-by-step telemetry, timeline progress grids, and talk with an interactive **Civic AI Chat Assistant** to check status updates.

---

## 🛠️ Key Features

### 1. **Hyperlocal Hazard Reporter Wizard (Citizen)**
* **Aesthetic Stepper UX**: A four-step visual reporting pipeline (Category Selection, Context & Image Upload, Geolocation Pinpoint, and final AI Triage).
* **AI Suggested Examples**: Auto-fills highly realistic contextual descriptions for Roads, Water, Streetlights, and Waste to allow effortless sandbox testing.
* **Base64 Evidence Pipeline**: Supports drag-and-drop or manual camera uploads, converting images to Base64 to feed directly into Gemini's multi-modal processing layer.
* **Auto-Geolocation Pinpoint**: Simulated coordinates lookup maps the exact street/landmark.

### 2. **Gemini 2.5 Flash Real-Time Triage (Admin & Citizen Review)**
* Shows the live classification, immediate hazard severity, dynamic priority score, and assigned municipal ward.
* Predicts future structural risks if left unattended, analyzing environmental deterioration over time.

### 3. **Command Control & Crew Dispatch Desk (Admin)**
* Dynamic sorting of ward incident queues by priority score or newest reports.
* Live patch logs, allowing admins to set tickets to *Verified*, *Under Work*, or *Resolved*, using pre-defined field crew update templates or custom memos.

### 4. **Ward Health Index & Live Analytics Dashboard**
* Calculates a dynamic neighborhood safety percentage score (e.g., **94% Greenwood District Health**) based on active vs resolved priority indices.
* Staggered radar visual element displaying scanned active nodes and simulated radar sweep.

### 5. **Interactive Civic AI Chat Companion**
* A friendly, persistent floating chatbot panel powered by **Gemini 2.5 Flash**.
* Injects active ward tickets and status history into the system instructions context, letting citizens query the database in natural language (e.g., *"What is the status of ticket #comp_1?"* or *"How is our neighborhood road score calculated?"*).

---

## 🚀 Google Technologies Utilized

1. **Google Gemini 2.5 Flash Model (`gemini-2.5-flash`)**: Used for both highly complex multi-modal image analysis and conversational assistant interfaces.
2. **Gemini Structured JSON Outputs (`responseMimeType: "application/json"`)**: Configured with strict JSON schema structures on the backend to enforce reliable output objects, ensuring the AI strictly returns category, severity, priority numbers, and risks without stray conversational filler.
3. **Gemini System Instructions Contextualization**: Integrates dynamic database complaints directly into the AI's internal prompts, enabling contextual memory of current neighborhood affairs.
4. **Google Cloud Run Ready**: Fully Dockerized, utilizing port `3000` on interface bind `0.0.0.0` for robust, scalable container hosting.

---

## 🎨 Design & Aesthetic Pairings

* **Visual Theme**: *Teal & Slate Midnight Minimalist*—generous negative space, high-contrast typography, and glowing borders designed for emergency accessibility.
* **Typography**: Clean, highly readable geometric system fonts for standard UI text, paired with `JetBrains Mono` for priority metrics, ticket ID badges, and telemetry outputs.
* **Micro-Animations**: Staggered transition fade-ins, looping radar radar pulses, glowing scanners, and responsive interactive transitions powered by Tailwind.

---

## 🏗️ Architecture & AI Workflow

```
[ Citizen Photo & Info ]
        │
        ▼ (Express Server API: /api/analyze-issue)
┌────────────────────────────────────────────────────────┐
│               Civic Guardian AI Engine                 │
│                                                        │
│  1. Multimodal payload construction (Image + Text)     │
│  2. Ingress query to Google GenAI Client SDK           │
│  3. Model 'gemini-2.5-flash' handles visual/text check │
│  4. Enforces Strict JSON Schema output configuration    │
└────────────────────────────────────────────────────────┘
        │
        ▼ (Structured Triage Data)
┌────────────────────────────────────────────────────────┐
│            MongoDB & JSON Adapter Fallback             │
│                                                        │
│  1. Saves records with default status 'Pending'        │
│  2. Stores priority scores, risk forecasts, and depts  │
│  3. Multi-source adapter guarantees zero-downtime      │
└────────────────────────────────────────────────────────┘
        │
        ├──► Citizen Tracking Pipeline (Timeline, Ward scores, analytics)
        └──► Admin Command Desk (Dispatch logs, progress updates, crew memos)
```

---

## 📂 Project Directory Structure

```
├── server.ts                  # Entry point: Express server with Vite middleware integration
├── server/                    # Backend database models & schema configurations
│   ├── db.ts                  # Dynamic Adapter pattern supporting MongoDB + local JSON backup
│   ├── models.ts              # Mongoose database models for Citizen and Complaints
│   └── mongooseConnection.ts  # Database connection configurations for Cloud Run hosting
├── src/                       # Frontend application code (TypeScript + React 18)
│   ├── App.tsx                # Main App Router handling view selection & state
│   ├── types.ts               # Core TypeScript type models and schemas
│   ├── index.css              # Global styling containing custom Tailwind parameters
│   └── components/            # Highly modular, isolated UX components
│       ├── LandingPage.tsx    # Interactive homepage with smart city visual element & stats
│       ├── ReportIssue.tsx    # Multimodal report wizard (AI suggestion & image support)
│       ├── ComplaintTracking.tsx # Citizen live ticket tracker & work order logs
│       ├── AdminDashboard.tsx # command panel for municipal dispatch, crews, and status
│       ├── AIAssistant.tsx    # Gemini conversational assistant chatbot drawer
│       └── Navbar.tsx         # Modular responsive header layout
├── metadata.json              # App manifest containing framework permissions
└── .env.example               # Template for environment configurations (Gemini keys, MongoDB)
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file at the root of the project using the structure from `.env.example`:

```env
# Google Gemini API key used for Multimodal Triage and Conversational Assistant
GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) MongoDB connection string for production database hosting.
# The app automatically falls back to a clean data.json system if this is omitted.
MONGODB_URI=mongodb+srv://...
```

---

## 🏃 Local Development Quickstart

1. **Clone the repository**:
   ```bash
   git clone <repo_url>
   cd civic-guardian-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure your API Keys**:
   Ensure you have defined `GEMINI_API_KEY` in your environment or in a `.env` file.

4. **Launch the development server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000` to interact with the application.

5. **Lint and verify the TypeScript build compiles**:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🚀 Google Cloud Run Production Deployment

To package and deploy Civic Guardian AI directly to Google Cloud Run:

```bash
# 1. Build the production application container
gcloud builds submit --tag gcr.io/your-project-id/civic-guardian-ai

# 2. Deploy the container to Cloud Run, setting PORT=3000 and binding 0.0.0.0
gcloud run deploy civic-guardian-ai \
  --image gcr.io/your-project-id/civic-guardian-ai \
  --platform managed \
  --port 3000 \
  --set-env-vars="GEMINI_API_KEY=your_api_key_here,NODE_ENV=production" \
  --allow-unauthenticated
```

---

## 🏆 Hackathon Judges' Testing Guide

To experience the full extent of Civic Guardian AI's intelligent features:
1. **On the Homepage**: Notice the responsive **Smart Ward Health Index Circle** and the custom **Smart-City Radar Graphic** visualizing simulated ward activity.
2. **File a Multimodal Report**: Click *Report Local Issue*. Choose a category, then click **AI Suggest Example** in Step 2. This populates a high-quality, realistic public issue context. Add an image if desired, choose a landmark in Step 3, and hit **Analyze with Civic AI**.
3. **Review Triage Output**: See how **Gemini 2.5 Flash** acts as an expert officer, predicting exact risk levels, severity ratings, and recommending engineering steps. Confirm and submit the report!
4. **Command Center Crew Dispatch**: Switch the navbar to **Admin Command**. Select your filed ticket. Click **Under Work**, click on any of the **Suggested Update Templates** to load a realistic field crew comment, and click **Publish**.
5. **Live Tracking Logs**: Return to **Track Incident** as a citizen to view your updated status history with full workflow step progressions.
6. **Chat with the Assistant**: Open the floating assistant bubble in the bottom right. Ask: *"What is the status of my ticket #comp_1?"* or *"What is the current health index of Greenwood?"*. Watch how Gemini queries the active database states and answers contextually!

---

*Civic Guardian AI was crafted with precision to show the power of multimodal LLMs in optimizing municipal operations and fostering trusted community engagement.* 🏛️✨
