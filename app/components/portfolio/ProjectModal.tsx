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

      {/* SVG Architecture Diagram */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox="0 0 800 320" className="w-full min-w-[600px] h-auto">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={color} opacity="0.6" />
            </marker>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines */}
          <motion.path d="M 180 160 C 250 160, 280 160, 350 160" stroke="url(#lineGrad)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} />
          <motion.path d="M 180 280 C 250 280, 280 200, 350 180" stroke="url(#lineGrad)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} />
          <motion.path d="M 530 140 C 580 140, 600 80, 650 80" stroke="url(#lineGrad)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} />
          <motion.path d="M 530 180 C 580 180, 600 240, 650 240" stroke="url(#lineGrad)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.6 }} />

          {/* Labels */}
          <text x="90" y="30" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="600" textAnchor="middle">Frontend</text>
          <text x="440" y="30" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="600" textAnchor="middle">Backend</text>
          <text x="720" y="30" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="600" textAnchor="middle">Data & Services</text>

          {/* Mobile App */}
          <motion.g initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <rect x="20" y="80" width="160" height="160" rx="16" fill="url(#boxGrad)" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
            <rect x="75" y="100" width="50" height="80" rx="8" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
            <circle cx="100" cy="170" r="4" fill={accentColor} opacity="0.6" />
            <text x="100" y="205" fill="white" fontSize="13" fontWeight="600" textAnchor="middle">App Mobile</text>
            <text x="100" y="222" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">Passager & Chauffeur</text>
          </motion.g>

          {/* Admin */}
          <motion.g initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
            <rect x="20" y="260" width="160" height="50" rx="12" fill="url(#boxGrad)" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
            <rect x="55" y="272" width="24" height="16" rx="2" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
            <line x1="67" y1="288" x2="67" y2="292" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
            <line x1="60" y1="292" x2="74" y2="292" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
            <text x="130" y="290" fill="white" fontSize="12" fontWeight="500" textAnchor="middle">Dashboard Admin</text>
          </motion.g>

          {/* Server */}
          <motion.g initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} filter="url(#glow)">
            <rect x="350" y="100" width="180" height="120" rx="16" fill="url(#serverGrad)" stroke={color} strokeWidth="2" />
            <rect x="420" y="125" width="40" height="12" rx="3" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="432" cy="131" r="2" fill={accentColor} />
            <circle cx="448" cy="131" r="2" fill={accentColor} />
            <rect x="420" y="142" width="40" height="12" rx="3" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="432" cy="148" r="2" fill={accentColor} />
            <circle cx="448" cy="148" r="2" fill={accentColor} />
            <text x="440" y="180" fill="white" fontSize="14" fontWeight="700" textAnchor="middle">Serveur</text>
            <text x="440" y="198" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">React Router v7 • Node.js</text>
          </motion.g>

          {/* Database */}
          <motion.g initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
            <rect x="650" y="50" width="130" height="60" rx="12" fill="url(#boxGrad)" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
            <ellipse cx="685" cy="70" rx="12" ry="6" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
            <path d="M673 70 L673 88 C673 91 678 94 685 94 C692 94 697 91 697 88 L697 70" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
            <text x="750" y="77" fill="white" fontSize="12" fontWeight="500" textAnchor="middle">MySQL</text>
            <text x="750" y="92" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">Prisma ORM</text>
          </motion.g>

          {/* Services */}
          <motion.g initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}>
            <rect x="650" y="200" width="130" height="80" rx="12" fill="url(#boxGrad)" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
            <path d="M675 230 C670 230 668 225 670 222 C670 218 675 216 680 218 C682 214 688 214 692 218 C696 216 702 218 702 224 C706 224 706 230 702 232 L675 232 C670 232 670 228 675 230 Z" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.8" />
            <text x="715" y="252" fill="white" fontSize="11" fontWeight="500" textAnchor="middle">Services Externes</text>
            <text x="715" y="268" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">Stripe • Maps • FCM</text>
          </motion.g>

          {/* Flow labels */}
          <text x="265" y="150" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">REST API</text>
          <text x="590" y="100" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">Prisma</text>
          <text x="590" y="220" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">Webhooks</text>
        </svg>
      </div>
    </motion.div>
  );
}

// Bento grid layout configuration - optimized to fill gaps
// Grid is 3 columns, cards are arranged to tessellate properly
const bentoLayout = [
  { colSpan: 2, rowSpan: 1, size: "wide" },     // 0: Overview
  { colSpan: 1, rowSpan: 2, size: "tall" },     // 1: Passenger
  { colSpan: 1, rowSpan: 1, size: "small" },    // 2: Tracking
  { colSpan: 1, rowSpan: 1, size: "small" },    // 3: Payments
  { colSpan: 1, rowSpan: 2, size: "tall" },     // 4: Driver
  { colSpan: 2, rowSpan: 1, size: "wide" },     // 5: Dashboard
  { colSpan: 1, rowSpan: 1, size: "small" },    // 6: Notifications
  { colSpan: 1, rowSpan: 1, size: "small" },    // 7: Admin
  { colSpan: 3, rowSpan: 1, size: "full" },     // 8: Technical
];

// Icons for each section
const sectionIcons: Record<string, React.ReactNode> = {
  overview: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  passenger: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
  driver: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
            <p className="text-white/70 leading-relaxed text-base">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Client", value: project.client },
                  { label: "Role", value: project.role },
                  { label: "Durée", value: project.duration },
                  { label: "Année", value: project.year },
                ].map(({ label, value }) => (
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
