/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  TrendingDown, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Loader2, 
  Wrench, 
  Calendar, 
  MessageSquare, 
  FileSpreadsheet,
  ArrowUpDown
} from 'lucide-react';
import { Complaint, ComplaintStatus, IssueCategory } from '../types';

interface AdminDashboardProps {
  complaints: Complaint[];
  onRefresh: () => void;
  setCurrentView: (view: string) => void;
}

export default function AdminDashboard({
  complaints,
  onRefresh,
  setCurrentView
}: AdminDashboardProps) {
  // Selection and filter states
  const [selectedId, setSelectedId] = useState<string | null>(complaints[0]?.id || null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'newest'>('priority');

  // Status updating form states
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Verified');
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const activeComplaint = complaints.find(c => c.id === selectedId) || complaints[0];

  // Templates to easily populate comments for field crews
  const commentTemplates: Record<ComplaintStatus, string[]> = {
    'Pending': [
      'Report received. Dispatched automated AI triage engine.'
    ],
    'Verified': [
      'Incident verified by smart city engine. Dispatching engineering inspection team.',
      'Citizen photographs approved. Dispatched emergency road surveyor.'
    ],
    'Under Work': [
      'Work order #W-552 issued to localized repairs crew. Heavy machinery arriving on site.',
      'Field crew on site. Initiating main repair work and securing local perimeter.'
    ],
    'Resolved': [
      'Asphalt cold-patch completed. Debris cleared and traffic flow fully restored.',
      'Sewer line successfully unclogged and sealed. Normal water pressure returned.',
      'Streetlight unit luminaire replaced and electrical cables insulated. Lighting online.'
    ]
  };

  const handleApplyTemplate = (tpl: string) => {
    setUpdateMessage(tpl);
  };

  // Submit PATCH to change status
  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint || !updateMessage.trim()) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/complaints/${activeComplaint.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          message: updateMessage
        })
      });

      if (res.ok) {
        onRefresh(); // Refresh parent state
        setUpdateMessage('');
      } else {
        throw new Error('Failed to post status update.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter complaints queue
  const filteredQueue = complaints
    .filter(c => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      
      const query = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="admin_dashboard_root">
      
      {/* Top Banner */}
      <div className="mb-8 rounded-3xl border border-slate-950 bg-slate-950 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 text-xs font-semibold mb-3">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Internal Administration Panel</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Civic Dispatch & Command Control
            </h2>
            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              Inspect AI-prioritized safety hazards, coordinate municipal field crews, and record update logs.
            </p>
          </div>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block uppercase text-[9px] font-bold">Unresolved</span>
              <strong className="text-xl text-amber-400 font-extrabold">
                {complaints.filter(c => c.status !== 'Resolved').length}
              </strong>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div>
              <span className="text-slate-400 block uppercase text-[9px] font-bold">Total Ward Queue</span>
              <strong className="text-xl text-white font-extrabold">{complaints.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: ACTIVE QUEUE (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Controls Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket code, landmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Grid Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-semibold focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Under Work">Under Work</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-semibold focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Road">Road</option>
                  <option value="Water">Water</option>
                  <option value="Streetlight">Streetlight</option>
                  <option value="Waste">Waste</option>
                </select>
              </div>
            </div>

            {/* Sorting Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">Sort Priority</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSortBy('priority')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg ${
                    sortBy === 'priority' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Priority Score
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg ${
                    sortBy === 'newest' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Newest First
                </button>
              </div>
            </div>

          </div>

          {/* Active Queue List */}
          <div className="max-h-[600px] overflow-y-auto space-y-2.5 pr-1" id="admin_queue_list">
            {filteredQueue.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                No tickets matching current filters.
              </div>
            ) : (
              filteredQueue.map((c) => {
                const isSelected = activeComplaint && activeComplaint.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? 'border-slate-900 bg-slate-50 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    id={`queue_ticket_${c.id}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {c.id}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-[10px] font-bold text-slate-500">{c.category}</span>
                        </div>
                        
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

                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                        {c.title}
                      </h4>
                      
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{c.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100/60 flex items-center justify-between">
                      <span className="text-[9px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                      
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        AI Priority: {c.priorityScore || 5}/10
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ACTION PANEL & DISPATCH CONTROLS (7 COLS) */}
        <div className="lg:col-span-7">
          {!activeComplaint ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-sm text-slate-400">Select an incident from the queue to manage</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Incident Inspector Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      TICKET #{activeComplaint.id}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900 mt-1.5">
                      {activeComplaint.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setCurrentView('tracking')}
                    className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    View Citizen Tracker <ChevronRight className="h-3 w-3 ml-0.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic mb-4">
                  "{activeComplaint.description}"
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Location Landmark</span>
                    <p className="font-semibold text-slate-700">{activeComplaint.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">Reporter name</span>
                    <p className="font-semibold text-slate-700">{activeComplaint.citizenName}</p>
                  </div>
                </div>

                {activeComplaint.imageUrl && (
                  <div className="relative rounded-2xl overflow-hidden h-40 bg-slate-100 mb-4 border border-slate-100">
                    <img 
                      src={activeComplaint.imageUrl} 
                      alt="Hazard evidence" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Gemini AI Dispatch Assistant Triage Results */}
              {activeComplaint.aiAnalysis && (
                <div className="rounded-3xl border border-emerald-100 bg-emerald-950 text-white p-6 shadow-md">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                    <h4 className="font-display font-bold text-sm text-white">Gemini AI Smart Dispatch Triage</h4>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-emerald-900/35 p-2.5 rounded-xl border border-emerald-800/30 text-center">
                      <span className="text-[8px] text-emerald-400 uppercase font-bold block">Priority Rating</span>
                      <strong className="text-lg text-white font-mono">{activeComplaint.aiAnalysis.priorityScore}/10</strong>
                    </div>
                    <div className="bg-emerald-900/35 p-2.5 rounded-xl border border-emerald-800/30 text-center">
                      <span className="text-[8px] text-emerald-400 uppercase font-bold block">Severity Level</span>
                      <strong className="text-sm text-white block mt-1">{activeComplaint.aiAnalysis.severity}</strong>
                    </div>
                    <div className="bg-emerald-900/35 p-2.5 rounded-xl border border-emerald-800/30 text-center">
                      <span className="text-[8px] text-emerald-400 uppercase font-bold block">Predicted Class</span>
                      <strong className="text-xs text-white block mt-1 truncate">{activeComplaint.aiAnalysis.issueType}</strong>
                    </div>
                    <div className="bg-emerald-900/35 p-2.5 rounded-xl border border-emerald-800/30 text-center">
                      <span className="text-[8px] text-emerald-400 uppercase font-bold block">Assigned Ward</span>
                      <strong className="text-xs text-white block mt-1 truncate">{activeComplaint.aiAnalysis.suggestedDepartment}</strong>
                    </div>
                  </div>

                  <div className="text-xs space-y-2 pt-3 border-t border-emerald-800/40">
                    <p>
                      <strong className="text-emerald-400 text-[10px] block uppercase">Recommended Triage Action:</strong>
                      <span className="text-slate-200 font-medium leading-relaxed">{activeComplaint.aiAnalysis.recommendedAction}</span>
                    </p>
                    <p>
                      <strong className="text-emerald-400 text-[10px] block uppercase">Risk Assessment & Multi-hazard proximity:</strong>
                      <span className="text-slate-300 italic leading-relaxed">"{activeComplaint.aiAnalysis.riskAssessment.explanation}"</span>
                    </p>
                  </div>
                </div>
              )}

              {/* LIVE DISPATCH UPDATE CONTROL PANEL */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
                  <Wrench className="mr-1.5 h-4 w-4 text-slate-400" />
                  MUNICIPALITY DISPATCH CONTROL
                </h4>

                <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
                  {/* Status Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Set Progress Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Verified', 'Under Work', 'Resolved'] as ComplaintStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setNewStatus(st);
                            setUpdateMessage(''); // Clear comment to load fresh template
                          }}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer text-center ${
                            newStatus === st 
                              ? 'border-slate-900 bg-slate-950 text-white shadow-sm' 
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Templates based on selected status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                      Suggested Update Templates
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {commentTemplates[newStatus]?.map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplyTemplate(tpl)}
                          className="text-left text-xs bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200/50 text-slate-600 transition leading-relaxed cursor-pointer"
                        >
                          {tpl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Textarea Field Comment */}
                  <div>
                    <label htmlFor="admin_memo_input" className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                      Internal Field Update Memo
                    </label>
                    <textarea
                      id="admin_memo_input"
                      rows={3}
                      placeholder="Type specific action reports completed, crew names, or materials used..."
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs focus:border-slate-800 focus:outline-none leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating || !updateMessage.trim()}
                      className="inline-flex items-center rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-3 text-xs font-bold text-white shadow transition disabled:opacity-50 cursor-pointer"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Submitting Memo...
                        </>
                      ) : (
                        'Publish Dispatch Status Update'
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
