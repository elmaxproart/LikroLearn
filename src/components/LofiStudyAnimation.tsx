'use client';

import React from 'react';

export default function LofiStudyAnimation() {
  return (
    <div className="w-full max-w-[420px] mx-auto aspect-square relative flex items-center justify-center p-4">
      {/* CSS Animations Declarations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          50% { transform: translateY(-10px) scaleX(1.2); opacity: 0.5; }
          100% { transform: translateY(-20px) scaleX(0.8); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.4)); }
          50% { filter: drop-shadow(0 0 16px rgba(59, 130, 246, 0.7)); }
        }
        @keyframes lampGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        @keyframes pageFlip {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-3deg) skewY(-2deg); }
        }
        @keyframes starBlink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes headBob {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(3px) rotate(1deg); }
        }
        .animate-steam1 { animation: steam 3s infinite ease-out; }
        .animate-steam2 { animation: steam 3.5s infinite ease-out 1.2s; }
        .animate-glow { animation: glow 4s infinite ease-in-out; }
        .animate-lamp { animation: lampGlow 5s infinite ease-in-out; }
        .animate-page { animation: pageFlip 6s infinite ease-in-out; transform-origin: left bottom; }
        .animate-star { animation: starBlink 2.5s infinite ease-in-out; }
        .animate-head { animation: headBob 4s infinite ease-in-out; transform-origin: 180px 220px; }
      `}} />

      <svg
        viewBox="0 0 400 400"
        className="w-full h-full object-contain"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky / Window Background */}
        <rect x="30" y="40" width="180" height="220" rx="10" fill="#0b132b" />
        
        {/* Blinking Stars */}
        <circle cx="60" cy="80" r="1.5" fill="#fff" className="animate-star" style={{ animationDelay: '0.2s' }} />
        <circle cx="100" cy="60" r="1" fill="#fff" className="animate-star" style={{ animationDelay: '1.2s' }} />
        <circle cx="160" cy="90" r="2" fill="#fff" className="animate-star" style={{ animationDelay: '0.7s' }} />
        <circle cx="80" cy="140" r="1" fill="#fff" className="animate-star" style={{ animationDelay: '1.9s' }} />
        <circle cx="140" cy="170" r="1.5" fill="#fff" className="animate-star" style={{ animationDelay: '2.3s' }} />

        {/* Crescent Moon */}
        <path d="M 170 60 A 20 20 0 1 0 190 80 A 15 15 0 1 1 170 60" fill="#fef08a" opacity="0.85" />

        {/* City Skyline Silhouette outside the window */}
        <rect x="30" y="190" width="25" height="70" fill="#1c2541" />
        <rect x="55" y="210" width="30" height="50" fill="#1c2541" />
        <rect x="85" y="180" width="35" height="80" fill="#0f172a" />
        <rect x="120" y="200" width="20" height="60" fill="#1c2541" />
        <rect x="140" y="220" width="40" height="40" fill="#1c2541" />
        <rect x="180" y="195" width="30" height="65" fill="#0f172a" />

        {/* Window Frame */}
        <rect x="30" y="40" width="180" height="220" rx="10" stroke="#334155" strokeWidth="6" fill="none" />
        <line x1="120" y1="40" x2="120" y2="260" stroke="#334155" strokeWidth="4" />
        <line x1="30" y1="150" x2="210" y2="150" stroke="#334155" strokeWidth="4" />

        {/* Desk Lamp (Light cone behind the student) */}
        <polygon points="320,100 200,320 380,320" fill="url(#lamp_beam)" className="animate-lamp" />

        {/* Desk Surface */}
        <rect x="10" y="300" width="380" height="20" rx="5" fill="#5c3d2e" />
        <rect x="10" y="320" width="380" height="80" fill="#3e2723" />

        {/* The Student (Lofi Head bobbing) */}
        <g className="animate-head">
          {/* Back of Chair */}
          <path d="M 120 310 Q 110 230 140 230 Q 160 230 150 310" fill="#1e293b" />
          {/* Torso/Sweater */}
          <path d="M 130 310 Q 150 250 180 250 Q 210 250 230 310 Z" fill="#475569" />
          <path d="M 170 250 Q 180 230 190 250" fill="#334155" strokeWidth="2" /> {/* Collar */}
          {/* Head & Face (Profile leaning forward studying) */}
          <circle cx="185" cy="205" r="22" fill="#fed7aa" />
          {/* Closed Eyes / Lashes */}
          <path d="M 188 206 Q 192 208 196 206" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Ear */}
          <circle cx="173" cy="207" r="4.5" fill="#fdba74" />
          {/* Hair (Messy top bun lofi style) */}
          <path d="M 160 200 Q 170 170 195 185 Q 210 200 205 215 Q 195 210 180 215 Q 165 215 160 200" fill="#1e293b" />
          <circle cx="180" cy="170" r="10" fill="#1e293b" /> {/* Bun */}
          {/* Arm leaning on desk */}
          <path d="M 180 270 Q 220 280 260 295" stroke="#475569" strokeWidth="14" strokeLinecap="round" />
        </g>

        {/* Laptop (Screen glowing) */}
        <rect x="270" y="220" width="80" height="60" rx="4" fill="#334155" transform="rotate(-10 270 220)" className="animate-glow" />
        <rect x="275" y="225" width="70" height="50" rx="2" fill="#60a5fa" opacity="0.8" transform="rotate(-10 270 220)" className="animate-glow" />
        {/* Laptop base */}
        <polygon points="255,283 335,268 360,295 270,295" fill="#1e293b" />

        {/* Study Notebook */}
        <g className="animate-page">
          <polygon points="180,298 240,298 250,285 190,285" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="195" y1="290" x2="235" y2="290" stroke="#94a3b8" strokeWidth="1" />
          <line x1="190" y1="294" x2="238" y2="294" stroke="#94a3b8" strokeWidth="1" />
        </g>

        {/* Coffee Mug with Rising Animated Steam */}
        <rect x="145" y="278" width="18" height="22" rx="3" fill="#0ea5e9" />
        <path d="M 163 283 Q 168 283 168 288 Q 168 293 163 293" stroke="#0ea5e9" strokeWidth="2.5" fill="none" />
        {/* Steam vector lines */}
        <path d="M 150 272 Q 148 265 152 260" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" className="animate-steam1" />
        <path d="M 156 273 Q 158 266 154 258" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" fill="none" className="animate-steam2" />

        {/* Desk Lamp Physical structure */}
        <rect x="340" y="160" width="10" height="140" rx="2" fill="#475569" />
        <path d="M 320 160 L 360 160" stroke="#334155" strokeWidth="4" />
        <path d="M 345 160 Q 345 100 310 95" stroke="#475569" strokeWidth="6" fill="none" />
        {/* Lamp Shade head */}
        <polygon points="295,90 325,90 330,110 290,110" fill="#3b82f6" transform="rotate(15 310 100)" />
        <ellipse cx="307" cy="108" rx="15" ry="5" fill="#fef08a" transform="rotate(15 310 100)" />

        {/* Definitions */}
        <defs>
          <linearGradient id="lamp_beam" x1="320" y1="100" x2="290" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#fef08a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
