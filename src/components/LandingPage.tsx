/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Sparkles, MapPin, Users, CheckCircle2, TrendingUp, AlertCircle, ArrowRight, Brain, Clock } from 'lucide-react';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
}

export default function LandingPage({ setCurrentView }: LandingPageProps) {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in" id="landing_page_root">
      
      {/* Self-contained animations style */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(176px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>

      {/* Hero Banner with dual-column grid on large screens */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 lg:p-16 mb-8 shadow-xl shadow-slate-200">
        <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 h-80 w-80 bg-blue-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-6">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>AI-Powered Hyperlocal Civic Resolution</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-[1.15]">
              AI-Powered Civic Intelligence, <span className="text-emerald-400">Community-Driven Action</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
              Civic Guardian AI bridges the gap between community members and municipal authorities. Report local hazards, generate instant AI triage with risk forecasting, and track resolutions transparently.
            </p>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setCurrentView('report')}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-150 active:scale-95 cursor-pointer"
                id="hero_btn_report"
              >
                Report Local Issue
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150 cursor-pointer"
                id="hero_btn_track"
              >
                Track Ongoing Work
              </button>
            </div>
          </div>

          {/* Right Column: Smart-City Community Visual Element */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-slate-950/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
              {/* Card background subtle glow */}
              <div className="absolute -top-12 -right-12 h-32 w-32 bg-emerald-500/10 blur-2xl rounded-full"></div>
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Greenwood Ward Triage</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  AI Active
                </span>
              </div>

              {/* Smart City Radar / Node Grid */}
              <div className="relative h-44 bg-slate-900/50 rounded-xl border border-slate-800/60 flex items-center justify-center overflow-hidden mb-4">
                {/* Concentric circles */}
                <div className="absolute h-36 w-36 rounded-full border border-slate-800/50 animate-pulse"></div>
                <div className="absolute h-24 w-24 rounded-full border border-slate-800/40"></div>
                <div className="absolute h-12 w-12 rounded-full border border-slate-800/30"></div>
                
                {/* Axes */}
                <div className="absolute w-full h-[1px] bg-slate-800/30"></div>
                <div className="absolute h-full w-[1px] bg-slate-800/30"></div>

                {/* Simulated Network Nodes */}
                {/* Node 1: Road Hazard (Amber) */}
                <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-[8px] font-mono text-amber-400 mt-1 bg-slate-950/80 px-1.5 py-0.5 rounded border border-amber-500/10">Road Triage</span>
                </div>

                {/* Node 2: Water Leak (Blue) */}
                <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-[8px] font-mono text-blue-400 mt-1 bg-slate-950/80 px-1.5 py-0.5 rounded border border-blue-500/10">Water Line</span>
                </div>

                {/* Node 3: Streetlight (Green/Emerald) */}
                <div className="absolute top-1/2 right-1/3 flex flex-col items-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 mt-1 bg-slate-950/80 px-1.5 py-0.5 rounded border border-emerald-500/10">Active Utility</span>
                </div>

                {/* Inter-node paths */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                  <line x1="25%" y1="25%" x2="66%" y2="50%" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="66%" y1="50%" x2="75%" y2="75%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
                </svg>

                {/* Glowing Sweep Scanner */}
                <div className="absolute inset-x-0 h-0.5 bg-emerald-500/30 top-0 animate-scan pointer-events-none"></div>
              </div>

              {/* Real-time Status Logs */}
              <div className="space-y-2 font-mono text-[9px] text-slate-400">
                <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded border border-slate-800/40">
                  <span className="flex items-center"><span className="h-1 w-1 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>AI PRIORITY MODEL</span>
                  <span className="text-emerald-400">INFERENCE READY</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/40 p-2 rounded border border-slate-800/40">
                  <span className="flex items-center"><span className="h-1 w-1 bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>RESOLVED INCIDENTS</span>
                  <span className="text-blue-400">ACTIVE COMMITS</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* AI Capabilities Section (Row format near hero) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12" id="ai_capabilities_grid">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-500/25 transition-all duration-200">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Brain className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-display text-sm text-slate-900 mb-1">AI Issue Detection</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Gemini computer vision instantly parses photos to identify and categorize civic hazards.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500/25 transition-all duration-200">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-display text-sm text-slate-900 mb-1">Risk Prediction</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Forecasts damage progression over seasons and rainfall to pre-empt critical road washouts.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-500/25 transition-all duration-200">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-display text-sm text-slate-900 mb-1">Smart Prioritization</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Assigns transparent gravity ratings (1-10) dynamically based on civic impact and density.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-500/25 transition-all duration-200">
          <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-display text-sm text-slate-900 mb-1">Complaint Tracking</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Check real-time telemetry from ticket filing to engineer verify and active field closure.
          </p>
        </div>
      </div>

      {/* Community Impact Summary & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900">92%</h3>
            <p className="text-sm text-slate-500 font-medium">Resolution Success Rate</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900">4.2 Hrs</h3>
            <p className="text-sm text-slate-500 font-medium">Avg. AI Verification Time</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900">1,240</h3>
            <p className="text-sm text-slate-500 font-medium">Active District Guardians</p>
          </div>
        </div>
      </div>

      {/* Core Hackathon Pitch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 mb-2">Guided Issue Reporting</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Report road cracks, pipe leakages, or faulty lighting with photos and simplified selection. No bureaucrat jargon.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 mb-2">Gemini AI Risk Triage</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our AI assesses damage size, projects seasonal risk progression (e.g. wet weather pothole growth), and auto-notifies the correct dispatch crew.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 mb-2">Full Transparency</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Check live timelines from report submission to verify, dispatch, repair, and closure. Keep the city accountable.
          </p>
        </div>
      </div>
    </div>
  );
}

