/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Wrench, 
  Droplets, 
  Lightbulb, 
  Trash2, 
  HelpCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Complaint, IssueCategory } from '../types';

interface CitizenDashboardProps {
  complaints: Complaint[];
  userPoints: number;
  navigateToTracking: (id: string) => void;
  setCurrentView: (view: string) => void;
  onRefresh: () => void;
}

interface CommunityStats {
  overallScore: number;
  healthScores: {
    category: string;
    score: number;
    totalCount: number;
    openCount: number;
  }[];
  totalComplaints: number;
  resolvedComplaints: number;
  underWorkComplaints: number;
  pendingComplaints: number;
}

export default function CitizenDashboard({
  complaints,
  userPoints,
  navigateToTracking,
  setCurrentView,
  onRefresh
}: CitizenDashboardProps) {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'my_reports' | 'all_reports'>('my_reports');

  // Filter complaints logged by current user Jane Citizen (usr_1)
  const myReports = complaints.filter(c => c.userId === 'usr_1');

  // Fetch server aggregated community metrics
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch('/api/community-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching community stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [complaints]);

  // Determine badge based on points
  const getBadgeTier = (pts: number) => {
    if (pts >= 200) return { title: 'Civic Steward', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Top tier community contributor' };
    if (pts >= 120) return { title: 'Active Guardian', color: 'bg-blue-100 text-blue-800 border-blue-200', desc: 'Frequent risk reporter' };
    return { title: 'First Responder', color: 'bg-slate-100 text-slate-700 border-slate-200', desc: 'Helpful neighbor' };
  };

  const badge = getBadgeTier(userPoints);

  // Get visual style for categories
  const getCategoryTheme = (cat: string) => {
    switch (cat as IssueCategory) {
      case 'Road': return { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', icon: Wrench };
      case 'Water': return { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', icon: Droplets };
      case 'Streetlight': return { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100', icon: Lightbulb };
      case 'Waste': return { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: Trash2 };
      default: return { color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', icon: HelpCircle };
    }
  };

  const activeReports = activeTab === 'my_reports' ? myReports : complaints;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="citizen_dashboard_root">
      
      {/* Welcome Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 items-stretch">
        
        {/* Welcome Text Panel */}
        <div className="md:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-3 py-1 text-xs font-semibold mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Hyperlocal Guard System Activated</span>
            </div>
            
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, Jane Citizen!
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              Your reported hazards are triaged instantly by Gemini AI, helping Greenwood Road Crews and Utility teams prioritize local safety tasks.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('report')}
              className="inline-flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-100 transition cursor-pointer"
            >
              Report Hyperlocal Hazard
            </button>
            <button
              onClick={() => setCurrentView('tracking')}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-600 transition cursor-pointer"
            >
              View Tracked Tickets
            </button>
          </div>
        </div>

        {/* Citizen Reputation & Points Gauge (4 COLS) */}
        <div className="md:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              CITIZEN REPUTATION
            </h3>
            <Award className="h-5 w-5 text-emerald-600 animate-pulse" />
          </div>

          <div className="my-4 text-center">
            <span className="text-4xl font-black text-slate-900 leading-none block">
              {userPoints}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
              REPUTATION POINTS
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4 text-left">
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase mb-1.5 ${badge.color}`}>
              {badge.title}
            </span>
            <p className="text-xs text-slate-500 font-medium">
              {badge.desc} — Complete active surveys and report structural hazards to earn bonuses!
            </p>
          </div>
        </div>

      </div>

      {/* Community Health Index Section */}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg font-bold">Greenwood District Ward Health Index</h3>
            <p className="text-xs text-slate-400">Dynamic safety ratings computed from pending vs resolved public orders</p>
          </div>
          <button 
            onClick={fetchStats}
            disabled={loadingStats}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
            title="Refresh statistics"
          >
            <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loadingStats || !stats ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mb-2" />
            <span className="text-xs text-slate-400">Recalculating community metrics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* BIG SCORE CIRCLE (4 COLS) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
              <div className="relative flex items-center justify-center h-32 w-32">
                {/* SVG Circle Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="54" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    className="text-slate-800"
                  />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="54" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={339.3}
                    strokeDashoffset={339.3 - (339.3 * stats.overallScore) / 100}
                    className="text-emerald-500 transition-all duration-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-white">{stats.overallScore}%</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">District index</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 text-center mt-3 max-w-xs leading-relaxed">
                {stats.overallScore >= 85 
                  ? 'Excellent. Most neighborhood infrastructure hazards are actively contained.' 
                  : 'Moderate. Wet-weather issues or streetlight darkzones require municipal attention.'}
              </p>
            </div>

            {/* DETAILED CATEGORY GRID (8 COLS) */}
            <div className="lg:col-span-8 space-y-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                CATEGORY BREAKDOWNS & WORK ORDERS
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stats.healthScores.map((h) => {
                  const theme = getCategoryTheme(h.category);
                  const Icon = theme.icon;
                  return (
                    <div key={h.category} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-100">{h.category}</span>
                        <Icon className={`h-4 w-4 ${theme.color}`} />
                      </div>

                      <div className="flex items-baseline space-x-1.5 mb-1.5">
                        <span className="text-xl font-black text-white">{h.score}%</span>
                        <span className="text-[10px] text-slate-400 font-semibold">health</span>
                      </div>

                      <div className="w-full bg-slate-800 rounded-full h-1">
                        <div 
                          className="bg-emerald-400 h-1 rounded-full transition-all duration-500" 
                          style={{ width: `${h.score}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5 text-[9px] text-slate-400 font-medium">
                        <span>Total: {h.totalCount}</span>
                        <span className={h.openCount > 0 ? 'text-amber-400' : 'text-slate-400'}>
                          Open: {h.openCount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* General Aggregates */}
              <div className="flex flex-wrap gap-4 justify-between items-center bg-white/5 rounded-2xl p-3 border border-white/5 text-xs text-slate-300">
                <span>Total Registered: <strong className="text-white">{stats.totalComplaints}</strong></span>
                <span>Resolved: <strong className="text-emerald-400">{stats.resolvedComplaints}</strong></span>
                <span>Active Repair Crew: <strong className="text-blue-400">{stats.underWorkComplaints}</strong></span>
                <span>Pending Verification: <strong className="text-amber-400">{stats.pendingComplaints}</strong></span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* LOWER TABBED CONTENT AREA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="incident_reports_section">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('my_reports')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'my_reports' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Reported Problems ({myReports.length})
            </button>
            <button
              onClick={() => setActiveTab('all_reports')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeTab === 'all_reports' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              District Wide Board ({complaints.length})
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-medium">
            Click any incident to track live work orders and crews.
          </p>
        </div>

        {/* Complaints Listing */}
        <div className="p-6">
          {activeReports.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h4 className="font-display font-bold text-slate-800">No reported hazards found</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeTab === 'my_reports' 
                  ? "You haven't filed any reports yet. Report a pothole or broken streetlight to get started!" 
                  : "No public reports have been recorded yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard_reports_grid">
              {activeReports.map((c) => {
                const theme = getCategoryTheme(c.category);
                const Icon = theme.icon;
                return (
                  <div
                    key={c.id}
                    onClick={() => navigateToTracking(c.id)}
                    className="flex flex-col rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-md transition duration-150 overflow-hidden cursor-pointer group"
                    id={`dashboard_report_card_${c.id}`}
                  >
                    {/* Thumbnail Image */}
                    {c.imageUrl ? (
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <img 
                          src={c.imageUrl} 
                          alt={c.title} 
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 right-2 bg-slate-900/85 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-md">
                          {c.id}
                        </span>
                      </div>
                    ) : (
                      <div className="h-40 w-full bg-slate-50 flex items-center justify-center border-b border-slate-100">
                        <Icon className={`h-8 w-8 ${theme.color}`} />
                      </div>
                    )}

                    {/* Description Block */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold ${theme.bg} ${theme.color}`}>
                            <Icon className="mr-1 h-3 w-3" />
                            {c.category}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            c.status === 'Resolved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : c.status === 'Under Work'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status}
                          </span>
                        </div>

                        <h4 className="font-semibold text-slate-900 text-sm line-clamp-1 mb-1 group-hover:text-emerald-700 transition">
                          {c.title}
                        </h4>
                        
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                          {c.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center truncate max-w-[150px]">
                          <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{c.location}</span>
                        </span>
                        
                        <span className="flex items-center text-emerald-600 font-bold group-hover:translate-x-0.5 transition">
                          Track Details
                          <ChevronRight className="ml-0.5 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
