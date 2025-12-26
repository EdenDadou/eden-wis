import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, ProjectMedia } from "../../types";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

function ArchitectureDiagram({ color, accentColor }: { color: string; accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
    >
      <h3 className="text-sm font-bold uppercase tracking-wider mb-8" style={{ color: accentColor }}>
        Architecture du Système
      </h3>

      {/* SVG Architecture Diagram - Clean horizontal flow */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox="0 0 800 500" className="w-full min-w-[600px] h-auto">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.12" />
              <stop offset="100%" stopColor={color} stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.08" />
            </linearGradient>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={accentColor} opacity="0.9" />
            </marker>
            <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#3B82F6" opacity="0.9" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ========== CLIENTS (Row 1) ========== */}

          {/* App Mobile */}
          <motion.g initial={{ opacity: 0, y: -15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
            <rect x="40" y="40" width="100" height="80" rx="10" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
            <rect x="75" y="50" width="22" height="36" rx="4" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
            <circle cx="86" cy="78" r="2.5" fill={accentColor} opacity="0.5" />
            <text x="90" y="100" fill="white" fontSize="10" fontWeight="600" textAnchor="middle">App Mobile</text>
            <text x="90" y="112" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">React Native</text>
          </motion.g>

          {/* Dashboard */}
          <motion.g initial={{ opacity: 0, y: -15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.15 }}>
            <rect x="40" y="140" width="100" height="80" rx="10" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
            <rect x="70" y="152" width="32" height="20" rx="3" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
            <rect x="73" y="156" width="8" height="2" rx="1" fill={accentColor} opacity="0.4" />
            <rect x="73" y="160" width="14" height="2" rx="1" fill={accentColor} opacity="0.3" />
            <rect x="73" y="164" width="10" height="2" rx="1" fill={accentColor} opacity="0.3" />
            <text x="90" y="190" fill="white" fontSize="10" fontWeight="600" textAnchor="middle">Dashboard</text>
            <text x="90" y="202" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">React Router</text>
          </motion.g>

          {/* ========== API SERVER (Center) ========== */}

          <motion.g initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} filter="url(#glow)">
            <rect x="220" y="70" width="120" height="100" rx="12" fill="url(#serverGrad)" stroke={color} strokeWidth="2" />
            <rect x="265" y="85" width="24" height="7" rx="2" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="272" cy="88.5" r="1.5" fill={accentColor} />
            <circle cx="282" cy="88.5" r="1.5" fill={accentColor} />
            <rect x="265" y="95" width="24" height="7" rx="2" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="272" cy="98.5" r="1.5" fill={accentColor} />
            <circle cx="282" cy="98.5" r="1.5" fill={accentColor} />
            <text x="280" y="125" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">API Server</text>
            <text x="280" y="140" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle">Node.js</text>
            <text x="280" y="152" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle">TypeScript</text>
          </motion.g>

          {/* ========== DATABASE ========== */}

          <motion.g initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.25 }}>
            <rect x="220" y="200" width="120" height="80" rx="10" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
            <ellipse cx="280" cy="220" rx="14" ry="6" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
            <path d="M266 220 L266 240 Q266 248 280 248 Q294 248 294 240 L294 220" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.7" />
            <text x="280" y="262" fill="white" fontSize="10" fontWeight="600" textAnchor="middle">Base de données</text>
            <text x="280" y="274" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">MySQL • Prisma</text>
          </motion.g>

          {/* ========== EXTERNAL SERVICES ========== */}

          {/* Google Maps */}
          <motion.g initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }}>
            <rect x="550" y="40" width="130" height="55" rx="8" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
            <circle cx="575" cy="58" r="8" fill="none" stroke="#4285F4" strokeWidth="1.5" />
            <path d="M575 50 L575 58 L580 63" fill="none" stroke="#EA4335" strokeWidth="1.5" />
            <text x="615" y="63" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">Géolocalisation</text>
            <text x="615" y="75" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">Google Maps</text>
          </motion.g>

          {/* Stripe */}
          <motion.g initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.35 }}>
            <rect x="550" y="105" width="130" height="55" rx="8" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
            <rect x="565" y="120" width="14" height="10" rx="2" fill="none" stroke="#635BFF" strokeWidth="1.5" />
            <line x1="568" y1="125" x2="576" y2="125" stroke="#635BFF" strokeWidth="1.5" />
            <text x="615" y="128" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">Paiements CB</text>
            <text x="615" y="140" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">Stripe</text>
          </motion.g>

          {/* Orange Money */}
          <motion.g initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 }}>
            <rect x="550" y="170" width="130" height="55" rx="8" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
            <circle cx="575" cy="190" r="8" fill="none" stroke="#FF6600" strokeWidth="1.5" />
            <text x="575" y="193" fill="#FF6600" fontSize="6" fontWeight="700" textAnchor="middle">OM</text>
            <text x="615" y="193" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">Mobile Money</text>
            <text x="615" y="205" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">Orange Money</text>
          </motion.g>

          {/* Firebase */}
          <motion.g initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.45 }}>
            <rect x="550" y="235" width="130" height="55" rx="8" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
            <path d="M568 270 L574 256 L577 262 L583 248 L583 270 Z" fill="none" stroke="#FFCA28" strokeWidth="1.5" />
            <text x="615" y="258" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">Notifications</text>
            <text x="615" y="270" fill="rgba(255,255,255,0.4)" fontSize="7" textAnchor="middle">Firebase</text>
          </motion.g>

          {/* ========== CONNECTIONS - APP LAYER ========== */}

          {/* App -> API */}
          <motion.path d="M 140 75 L 220 100" stroke="url(#lineGrad)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} />

          {/* Dashboard -> API */}
          <motion.path d="M 140 150 L 220 135" stroke="url(#lineGrad)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.55 }} />

          {/* API -> Database */}
          <motion.path d="M 280 170 L 280 200" stroke="url(#lineGrad)" strokeWidth="2" fill="none" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }} />

          {/* API -> Services (diagonal arrows) */}
          <motion.path d="M 340 100 L 550 67" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.65 }} />
          <motion.path d="M 340 115 L 550 132" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }} />
          <motion.path d="M 340 130 L 550 197" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.75 }} />
          <motion.path d="M 340 145 L 550 262" stroke="url(#lineGrad)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.8 }} />

          {/* ========== CI/CD SECTION ========== */}

          {/* Separator */}
          <motion.line x1="40" y1="310" x2="760" y2="310" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3,6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.85 }} />

          {/* GitHub Actions */}
          <motion.g initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.9 }}>
            <rect x="280" y="340" width="180" height="50" rx="8" fill="rgba(59,130,246,0.08)" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.5" />
            <circle cx="315" cy="358" r="10" fill="none" stroke="#3B82F6" strokeWidth="1.5" />
            <path d="M310 358 L313 361 L321 352" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="395" y="355" fill="white" fontSize="11" fontWeight="600" textAnchor="middle">GitHub Actions</text>
            <text x="395" y="370" fill="rgba(255,255,255,0.4)" fontSize="8" textAnchor="middle">Staging / Production</text>
          </motion.g>

          {/* ========== DEPLOYMENT TARGETS ========== */}

          {/* App Store */}
          <motion.g initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.95 }}>
            <rect x="220" y="430" width="100" height="55" rx="8" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
            <rect x="255" y="442" width="20" height="20" rx="4" fill="none" stroke="#007AFF" strokeWidth="1.5" />
            <text x="265" y="457" fill="#007AFF" fontSize="12" fontWeight="700" textAnchor="middle">A</text>
            <text x="270" y="475" fill="white" fontSize="9" fontWeight="500" textAnchor="middle">App Store</text>
          </motion.g>

          {/* Play Store */}
          <motion.g initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 1 }}>
            <rect x="420" y="430" width="100" height="55" rx="8" fill="url(#boxGrad)" stroke={color} strokeOpacity="0.3" strokeWidth="1" />
            <path d="M456 442 L456 462 L472 452 Z" fill="none" stroke="#34A853" strokeWidth="1.5" />
            <text x="470" y="475" fill="white" fontSize="9" fontWeight="500" textAnchor="middle">Play Store</text>
          </motion.g>

          {/* CI/CD -> Deployments */}
          <motion.path d="M 330 390 L 270 430" stroke="#3B82F6" strokeWidth="1.5" fill="none" markerEnd="url(#arrowBlue)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.05 }} />
          <motion.path d="M 410 390 L 470 430" stroke="#3B82F6" strokeWidth="1.5" fill="none" markerEnd="url(#arrowBlue)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.1 }} />
        </svg>
      </div>
    </motion.div>
  );
}

// Bento grid layout configuration - optimized to fill gaps
// Grid is 3 columns, cards are arranged to tessellate properly
const bentoLayout = [
  { colSpan: 2, rowSpan: 1, size: "wide" },     // 0: Overview
  { colSpan: 1, rowSpan: 2, size: "tall" },     // 1: Mobile App (passager + chauffeur)
  { colSpan: 1, rowSpan: 1, size: "small" },    // 2: Tracking
  { colSpan: 1, rowSpan: 1, size: "small" },    // 3: Payments
  { colSpan: 1, rowSpan: 1, size: "small" },    // 4: Dashboard
  { colSpan: 2, rowSpan: 1, size: "wide" },     // 5: Notifications
  { colSpan: 1, rowSpan: 1, size: "small" },    // 6: Admin
  { colSpan: 1, rowSpan: 1, size: "small" },    // 7: CI/CD
  { colSpan: 1, rowSpan: 1, size: "small" },    // 8: Stores
  { colSpan: 3, rowSpan: 1, size: "full" },     // 9: Technical
];

// Icons for each section
const sectionIcons: Record<string, React.ReactNode> = {
  design: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  overview: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  portfolio: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  landingBuilder: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  backoffice: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  bentoGrid: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  performance: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  architecture: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  mobileApp: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  tracking: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  payments: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  notifications: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  admin: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  cicd: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  stores: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  technical: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
};

function BentoCard({
  sectionKey,
  projectId,
  color,
  accentColor,
  index,
  layout,
  onClick,
}: {
  sectionKey: string;
  projectId: string;
  color: string;
  accentColor: string;
  index: number;
  layout: { colSpan: number; rowSpan: number; size: string };
  onClick: () => void;
}) {
  const { t } = useTranslation("common");
  const title = t(`portfolio.projects.${projectId}.sections.${sectionKey}.title`);
  const icon = sectionIcons[sectionKey];

  const gridClasses = `
    ${layout.colSpan === 3 ? "md:col-span-3" : layout.colSpan === 2 ? "md:col-span-2" : "col-span-1"}
    ${layout.rowSpan === 2 ? "md:row-span-2" : "row-span-1"}
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/25 cursor-pointer transition-all duration-300 ${gridClasses}`}
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}08, transparent)`,
      }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}25, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${color}30`, color: accentColor }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-white/90 transition-colors">
          {title}
        </h3>

        {/* Hover hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Voir détails</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Corner glow */}
      <div
        className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"
        style={{ background: color }}
      />
    </motion.div>
  );
}

// Detail popup for a section
function SectionDetail({
  section,
  projectId,
  color,
  accentColor,
  onClose,
}: {
  section: { key: string; media?: ProjectMedia[] };
  projectId: string;
  color: string;
  accentColor: string;
  onClose: () => void;
}) {
  const { t } = useTranslation("common");
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const title = t(`portfolio.projects.${projectId}.sections.${section.key}.title`);
  const content = t(`portfolio.projects.${projectId}.sections.${section.key}.content`);
  const hasMedia = section.media && section.media.length > 0;
  const currentMedia = hasMedia ? section.media![currentMediaIndex] : null;
  const icon = sectionIcons[section.key];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-gray-900/95 border border-white/10 backdrop-blur-xl"
        style={{ boxShadow: `0 0 80px ${color}25, 0 0 40px ${color}15` }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{ background: `linear-gradient(90deg, ${color}, ${accentColor})` }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors border border-white/10"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto max-h-[90vh]">
          {/* Media Section */}
          {hasMedia && (
            <div className="relative">
              {/* Main media display */}
              <div className="relative aspect-video bg-black/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMediaIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {currentMedia?.type === "video" ? (
                      <video
                        src={currentMedia.src}
                        className="w-full h-full object-contain bg-black"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={currentMedia?.src}
                        alt={currentMedia?.title || title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Media title overlay */}
                {currentMedia?.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/80 text-sm">{currentMedia.title}</p>
                  </div>
                )}

                {/* Navigation arrows */}
                {section.media!.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMediaIndex((prev) => (prev === 0 ? section.media!.length - 1 : prev - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors border border-white/10"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMediaIndex((prev) => (prev === section.media!.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors border border-white/10"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Video indicator */}
                {currentMedia?.type === "video" && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md flex items-center gap-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-white font-medium">Vidéo</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {section.media!.length > 1 && (
                <div className="flex gap-2 p-4 bg-black/30 overflow-x-auto">
                  {section.media!.map((media, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentMediaIndex(i);
                      }}
                      className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentMediaIndex ? "border-white/80 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {media.type === "video" ? (
                        <>
                          <video src={media.src} className="w-full h-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <img src={media.src} alt="" className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Header with icon */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${color}30`, color: accentColor }}
              >
                {icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {title}
                </h3>
                <div
                  className="h-1 w-16 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}, ${accentColor})` }}
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-white/70 leading-relaxed text-base whitespace-pre-line">
              {content}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation("common");
  const hasSections = project.sections && project.sections.length > 0;
  const isTchee = project.id === "tchee";
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  // Find architecture section with SVG media
  const architectureSection = project.sections?.find(
    s => s.key === "architecture" && s.media?.some(m => m.src.endsWith(".svg"))
  );
  const architectureSvg = architectureSection?.media?.find(m => m.src.endsWith(".svg"));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        className="relative w-full h-full md:h-[95vh] md:max-w-6xl md:rounded-2xl overflow-hidden bg-gray-900 md:border border-white/10"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accentColor})` }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xl flex items-center justify-center transition-colors border border-white/10"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="h-full overflow-y-auto">
          {/* Header with logo and tech */}
          {isTchee ? (
            <div className="relative py-10 px-6 md:px-10 overflow-hidden">
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src="/images/portfolio/tchee/header.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-900" />
              </div>

              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* App icon */}
                {project.icon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl border-2 shrink-0"
                    style={{ borderColor: `${project.color}50` }}
                  >
                    <img src={project.icon} alt="Tchee" className="w-full h-full object-cover" />
                  </motion.div>
                )}

                {/* Title, meta and technologies */}
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2"
                  >
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${project.color}30`, color: project.accentColor }}
                    >
                      Mobile App
                    </span>
                    <span className="text-white/40 text-sm">{project.year}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40 text-sm">{project.duration}</span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-black text-white mb-2"
                  >
                    {t(project.titleKey)}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-white/60 max-w-2xl mb-4"
                  >
                    {t(project.longDescriptionKey)}
                  </motion.p>

                  {/* Technologies - in header */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-1.5 justify-center md:justify-start"
                  >
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs border transition-colors"
                        style={{ borderColor: `${project.color}30`, color: project.accentColor, background: `${project.color}10` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* Stats on the right */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex md:flex-col gap-4 shrink-0"
                >
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: project.accentColor }}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          ) : (
            /* Original hero for other projects */
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
              <img src={project.image} alt={t(project.titleKey)} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              {project.icon && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="absolute bottom-32 left-6 md:left-10 w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                  <img src={project.icon} alt="App icon" className="w-full h-full object-cover" />
                </motion.div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ background: `${project.color}30`, color: project.accentColor }}>
                    {project.type === "web" ? "E-Commerce" : project.type === "dashboard" ? "SaaS" : "Mobile App"}
                  </span>
                  <span className="text-white/50">{project.year}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50">{project.duration}</span>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                  {t(project.titleKey)}
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-white/70 max-w-3xl">
                  {t(project.longDescriptionKey)}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-3 mt-6">
                  {project.stats.map((stat) => (
                    <div key={stat.label} className="px-4 py-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                      <div className="text-2xl font-bold" style={{ color: project.accentColor }}>{stat.value}</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="p-6 md:p-10 lg:p-12">
            {/* Architecture diagram for Tchee */}
            {isTchee && (
              <div className="mb-10">
                <ArchitectureDiagram color={project.color} accentColor={project.accentColor} />
              </div>
            )}

            {/* Architecture SVG diagram for other projects (like Sayyes) */}
            {!isTchee && architectureSvg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: project.accentColor }}>
                  {t(`portfolio.projects.${project.id}.sections.architecture.title`)}
                </h3>
                <div className="relative w-full overflow-x-auto rounded-xl">
                  <img
                    src={architectureSvg.src}
                    alt={architectureSvg.title || "Architecture"}
                    className="w-full h-auto min-w-[600px]"
                  />
                </div>
                <p className="mt-6 text-white/60 text-sm leading-relaxed">
                  {t(`portfolio.projects.${project.id}.sections.architecture.content`)}
                </p>
              </motion.div>
            )}

            {/* Bento Grid Features */}
            {hasSections && (
              <div className="mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 mb-8"
                >
                  <h2
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: project.accentColor }}
                  >
                    Fonctionnalités
                  </h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
                  <span className="text-xs text-white/30">{project.sections!.length} modules</span>
                </motion.div>

                {/* Bento Grid Layout */}
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  style={{ gridAutoRows: "160px" }}
                >
                  {project.sections!.map((section, index) => (
                    <BentoCard
                      key={section.key}
                      sectionKey={section.key}
                      projectId={project.id}
                      color={project.color}
                      accentColor={project.accentColor}
                      index={index}
                      layout={bentoLayout[index] || { colSpan: 1, rowSpan: 1, size: "small" }}
                      onClick={() => setSelectedSection(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section Detail Popup */}
            <AnimatePresence>
              {selectedSection !== null && project.sections && (
                <SectionDetail
                  section={project.sections[selectedSection]}
                  projectId={project.id}
                  color={project.color}
                  accentColor={project.accentColor}
                  onClose={() => setSelectedSection(null)}
                />
              )}
            </AnimatePresence>

            {/* Fallback features list */}
            {!hasSections && (
              <div className="mb-10">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: project.accentColor }}>
                  {t("portfolio.features")}
                </h3>
                <ul className="grid md:grid-cols-2 gap-3">
                  {(t(`portfolio.projects.${project.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.features`, { returnObjects: true }) as string[]).map((f, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${project.color}30` }}>
                        <svg className="w-3 h-3" style={{ color: project.accentColor }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white/70">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-5 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Client", value: project.client },
                  { label: "Role", value: project.role },
                  { label: "Durée", value: project.duration },
                  { label: "Équipe", value: project.team },
                  { label: "Année", value: project.year },
                ].filter(item => item.value).map(({ label, value }) => (
                  <div key={label}>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
                    <p className="text-white font-medium text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
