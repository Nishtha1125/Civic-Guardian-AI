/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ReportIssue from './components/ReportIssue';
import ComplaintTracking from './components/ComplaintTracking';
import CitizenDashboard from './components/CitizenDashboard';
import AdminDashboard from './components/AdminDashboard';
import AIAssistant from './components/AIAssistant';
import { Complaint } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(120);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch complaints from server API on mount
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Quick navigation helpers that handle selecting a complaint
  const navigateToTracking = (complaintId: string) => {
    setSelectedComplaintId(complaintId);
    setCurrentView('tracking');
  };

  // Render active view based on routing state
  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage setCurrentView={setCurrentView} />;
      case 'report':
        return (
          <ReportIssue 
            onComplaintSubmitted={(newComplaint) => {
              setComplaints(prev => [newComplaint, ...prev]);
              setSelectedComplaintId(newComplaint.id);
              setCurrentView('tracking');
            }} 
            setCurrentView={setCurrentView}
            incrementUserPoints={(pts) => setUserPoints(prev => prev + pts)}
          />
        );
      case 'tracking':
        return (
          <ComplaintTracking 
            complaints={complaints}
            selectedComplaintId={selectedComplaintId}
            setSelectedComplaintId={setSelectedComplaintId}
            onRefresh={fetchComplaints}
            setCurrentView={setCurrentView}
          />
        );
      case 'dashboard':
        return (
          <CitizenDashboard 
            complaints={complaints}
            userPoints={userPoints}
            navigateToTracking={navigateToTracking}
            setCurrentView={setCurrentView}
            onRefresh={fetchComplaints}
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            complaints={complaints}
            onRefresh={fetchComplaints}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return <LandingPage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-800" id="app_root">
      {/* Top Navigation Bar */}
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userPoints={userPoints} 
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {renderActiveView()}
      </main>

      {/* Floating AI Assistant Chat Widget Toggle */}
      <button
        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95"
        id="btn_toggle_ai_assistant"
        title="Open AI Civic Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.598.598 0 0 1-.747-.61a5.972 5.972 0 0 1 1.258-3.15C4.693 15.613 3 13.987 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </button>

      {/* AI Assistant Drawer Panel */}
      {isAssistantOpen && (
        <AIAssistant onClose={() => setIsAssistantOpen(false)} />
      )}

      {/* Bottom Footer Credits */}
      <footer className="py-6 border-t border-slate-200/60 bg-white text-center text-xs text-slate-400">
        <p>Civic Guardian AI © 2026 • Greenwood District Hyperlocal Hub • Built for Google Vibe2Ship Hackathon</p>
      </footer>
    </div>
  );
}
