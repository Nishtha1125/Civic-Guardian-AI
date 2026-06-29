/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Award, User, Bell, Activity } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userPoints: number;
}

export default function Navbar({ currentView, setCurrentView, userPoints }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and App Name */}
        <div 
          className="flex cursor-pointer items-center space-x-2.5" 
          onClick={() => setCurrentView('landing')}
          id="nav_logo_container"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-slate-900">
              Civic Guardian <span className="text-emerald-600">AI</span>
            </h1>
            <p className="font-mono text-[9px] font-medium uppercase tracking-wider text-slate-400">
              Hyperlocal Problem Solver
            </p>
          </div>
        </div>

        {/* View Switches (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1" id="nav_links_container">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              currentView === 'landing' 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav_btn_landing"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              currentView === 'dashboard' || currentView === 'tracking'
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav_btn_dashboard"
          >
            Citizen Space
          </button>
          <button
            onClick={() => setCurrentView('report')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              currentView === 'report' 
                ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav_btn_report"
          >
            Report Issue
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              currentView === 'admin' 
                ? 'bg-slate-900 text-white font-medium' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            id="nav_btn_admin"
          >
            Authority Portal
          </button>
        </nav>

        {/* User Stats & Badge */}
        <div className="flex items-center space-x-4" id="nav_user_container">
          {/* Points/Reputation Badge */}
          <div className="flex items-center space-x-1.5 rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1 text-amber-800" title="Community Impact Score">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold">{userPoints} pts</span>
          </div>

          {/* Quick Notification Bell */}
          <div className="relative rounded-full p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-700">Jane Citizen</p>
              <p className="text-[10px] text-slate-400">Greenwood District</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
