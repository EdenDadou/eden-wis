import type { Route } from "./+types/home";
import Scene from "../components/Scene";
import "../styles/global.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants, AnimatePresence, useInView } from "framer-motion";
import { Text } from "../components/Text";
import { ParticleText } from "../components/ParticleText";
import type { Experience } from "../components/Timeline3D";

// Portfolio interfaces and data
interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey: string;
  tags: string[];
  color: string;
  accentColor: string;
  image: string;
  mockups: string[];
  year: string;
  duration: string;
  client: string;
  role: string;
  stats: { label: string; value: string }[];
  type: "web" | "mobile" | "dashboard";
}

const projects: Project[] = [
  {
    id: "nova-fashion",
    titleKey: "portfolio.projects.novaFashion.title",
    descriptionKey: "portfolio.projects.novaFashion.description",
    longDescriptionKey: "portfolio.projects.novaFashion.longDescription",
    tags: ["Next.js 14", "Stripe", "PostgreSQL", "Tailwind CSS", "Elasticsearch", "Redis"],
    color: "#8B5CF6",
    accentColor: "#C4B5FD",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    mockups: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    ],
    year: "2024",
    duration: "4 mois",
    client: "Nova Fashion Group",
    role: "Lead Developer",
    stats: [
      { label: "Conversion", value: "+340%" },
      { label: "Lighthouse", value: "98/100" },
      { label: "Users", value: "50K+" },
    ],
    type: "web",
  },
  {
    id: "pulse-analytics",
    titleKey: "portfolio.projects.pulseAnalytics.title",
    descriptionKey: "portfolio.projects.pulseAnalytics.description",
    longDescriptionKey: "portfolio.projects.pulseAnalytics.longDescription",
    tags: ["React 18", "Node.js", "MongoDB", "D3.js", "WebSocket", "Docker"],
    color: "#06B6D4",
    accentColor: "#67E8F9",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    mockups: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
    ],
    year: "2024",
    duration: "6 mois",
    client: "Pulse Technologies",
    role: "Full-Stack Architect",
    stats: [
      { label: "Events/s", value: "10K+" },
      { label: "Uptime", value: "99.99%" },
      { label: "Clients", value: "120+" },
    ],
    type: "dashboard",
  },
  {
    id: "swift-delivery",
    titleKey: "portfolio.projects.swiftDelivery.title",
    descriptionKey: "portfolio.projects.swiftDelivery.description",
    longDescriptionKey: "portfolio.projects.swiftDelivery.longDescription",
    tags: ["React Native", "Firebase", "Google Maps", "Node.js", "Socket.io"],
    color: "#10B981",
    accentColor: "#6EE7B7",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200&h=800&fit=crop",
    mockups: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&h=600&fit=crop",
    ],
    year: "2023",
    duration: "5 mois",
    client: "Swift Logistics",
    role: "Mobile Lead",
    stats: [
      { label: "Livraisons", value: "1M+" },
      { label: "Rating", value: "4.9" },
      { label: "Drivers", value: "2K+" },
    ],
    type: "mobile",
  },
];

// Featured project card (large)
function FeaturedProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const { t } = useTranslation("common");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
        <div
          className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ background: `linear-gradient(135deg, ${project.color}30, transparent)` }}
        />

        <div className="relative grid lg:grid-cols-2 gap-0">
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
            <div className="absolute inset-4 lg:inset-6 rounded-xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
              <div className="h-8 bg-gray-800/90 flex items-center px-3 gap-1.5 border-b border-white/5">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-700/50 rounded-md h-5 max-w-[180px] flex items-center px-2 gap-1.5">
                    <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] text-white/50 font-mono">novafashion.com</span>
                  </div>
                </div>
              </div>
              <div className="relative h-[calc(100%-2rem)] overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={t(project.titleKey)}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: imageLoaded ? 1 : 1.1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10"
            >
              <div className="flex gap-2">
                {project.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="px-3 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10"
                  >
                    <div className="text-lg font-bold" style={{ color: project.accentColor }}>{stat.value}</div>
                    <div className="text-[9px] text-white/50 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="p-6 lg:p-10 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-4"
            >
              <span
                className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: `${project.color}20`, color: project.accentColor }}
              >
                {project.type === "web" ? "E-Commerce" : project.type === "dashboard" ? "SaaS" : "Mobile"}
              </span>
              <span className="text-white/40 text-sm">{project.year}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-3xl lg:text-4xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(135deg, white, ${project.accentColor})`,
                WebkitBackgroundClip: 'text',
              }}
            >
              {t(project.titleKey)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-base leading-relaxed mb-6"
            >
              {t(project.descriptionKey)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-1.5 mb-6"
            >
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/70 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${project.color}, ${project.color}aa)`,
                  boxShadow: `0 15px 30px -8px ${project.color}50`
                }}
              >
                <span>{t("portfolio.viewProject")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Project card (smaller)
function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  const { t } = useTranslation("common");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const isMobile = project.type === "mobile";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative cursor-pointer h-full"
    >
      <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accentColor})` }}
        />
        <div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ background: `${project.color}20` }}
        />

        <div className="relative p-5 flex flex-col h-full">
          <div className={`relative ${isMobile ? 'flex justify-center py-4' : 'mb-4'}`}>
            {isMobile ? (
              <div className="relative w-36 group-hover:scale-105 transition-transform duration-500">
                <div className="bg-gray-800 rounded-[2rem] p-1.5 shadow-2xl border-[3px] border-gray-700">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />
                  <div className="rounded-[1.5rem] overflow-hidden aspect-[9/19] bg-gray-900">
                    <img
                      src={project.image}
                      alt={t(project.titleKey)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </div>
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full blur-xl opacity-50"
                  style={{ background: project.color }}
                />
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden shadow-xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                <div className="h-6 bg-gray-800 flex items-center px-2 gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  {project.type === "dashboard" && (
                    <div className="ml-auto flex items-center gap-2 text-white/30 text-xs">
                      <div className="w-12 h-3 bg-white/10 rounded" />
                    </div>
                  )}
                </div>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={t(project.titleKey)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {project.type === "dashboard" && (
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {project.stats.slice(0, 2).map((stat) => (
                        <div key={stat.label} className="px-2 py-1 rounded-md bg-black/50 backdrop-blur border border-white/10">
                          <span className="text-xs font-bold" style={{ color: project.accentColor }}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                style={{ background: `${project.color}25`, color: project.accentColor }}
              >
                {project.type === "mobile" ? "App" : project.type === "dashboard" ? "SaaS" : "Web"}
              </span>
              <span className="text-white/40 text-xs">{project.year}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(135deg, white, ${project.accentColor})`,
                WebkitBackgroundClip: 'text',
              }}
            >
              {t(project.titleKey)}
            </h3>

            <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
              {t(project.descriptionKey)}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-white/60">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-3 border-t border-white/5">
              <div className="flex justify-between">
                {project.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-base font-bold" style={{ color: project.accentColor }}>{stat.value}</div>
                    <div className="text-[9px] text-white/40 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
            style={{ background: project.color }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Project Modal
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { t } = useTranslation("common");
  const [activeImage, setActiveImage] = useState(0);
  const allImages = [project.image, ...project.mockups];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
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
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border border-white/10"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accentColor})` }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-video overflow-hidden rounded-t-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={allImages[activeImage]}
              alt={t(project.titleKey)}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 flex gap-2">
            {project.stats.map((stat) => (
              <div key={stat.label} className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
                <div className="text-xl font-bold" style={{ color: project.accentColor }}>{stat.value}</div>
                <div className="text-xs text-white/50 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${activeImage === i ? 'w-6' : ''}`}
                style={{ background: activeImage === i ? project.color : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: `${project.color}20`, color: project.accentColor }}>
                    {project.year}
                  </span>
                  <span className="text-white/50">{project.duration}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">{t(project.titleKey)}</h2>
                <p className="text-base text-white/60 leading-relaxed">{t(project.longDescriptionKey)}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: project.accentColor }}>
                  {t("portfolio.features")}
                </h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  {(t(`portfolio.projects.${project.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.features`, { returnObjects: true }) as string[]).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ background: `${project.color}30` }}>
                        <svg className="w-2.5 h-2.5" style={{ color: project.accentColor }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white/70 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: project.accentColor }}>
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/80 border border-white/5">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Info Projet</h4>
                <div className="space-y-3">
                  {[
                    { label: "Client", value: project.client },
                    { label: "Role", value: project.role },
                    { label: "Duree", value: project.duration },
                    { label: "Annee", value: project.year },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-white/40">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}aa)` }}
              >
                <span>{t("portfolio.viewProject")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              <button className="w-full py-3 rounded-lg font-medium text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>{t("portfolio.viewCode")}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eden Wisniewski - Full-Stack Developer" },
    { name: "description", content: "Portfolio - Solutions IT complètes" },
  ];
}

export default function Home() {
  const [section, setSection] = useState(0);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [detailScrollOffset, setDetailScrollOffset] = useState(0);
  const [targetSection, setTargetSection] = useState<number | null>(null);
  const [showCard, setShowCard] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { t, i18n } = useTranslation("common");

  // Navigation functions for menu
  const navigateToSection = useCallback((sectionNumber: number) => {
    setSection(sectionNumber); // Set section immediately to prevent card animations
    setTargetSection(sectionNumber);
    setShowCard(false);

    // Show card with fade-in after 70% of animation (840ms of 1200ms)
    setTimeout(() => {
      setShowCard(true);
    }, 840);
  }, []);

  const handleNavigationComplete = useCallback(() => {
    setTargetSection(null);
  }, []);

  // Handle scroll for project detail view with snap
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSnappingRef = useRef(false);
  const targetOffsetRef = useRef(0);

  // Smooth snap animation
  useEffect(() => {
    if (!isSnappingRef.current) return;

    const animateSnap = () => {
      setDetailScrollOffset((prev) => {
        const diff = targetOffsetRef.current - prev;
        if (Math.abs(diff) < 0.01) {
          isSnappingRef.current = false;
          return targetOffsetRef.current;
        }
        return prev + diff * 0.15; // Smooth easing
      });

      if (isSnappingRef.current) {
        requestAnimationFrame(animateSnap);
      }
    };

    requestAnimationFrame(animateSnap);
  }, [isSnappingRef.current]);

  useEffect(() => {
    if (!selectedExperience) {
      setDetailScrollOffset(0);
      return;
    }

    const projectCount = selectedExperience.projects.length;
    const maxScroll = Math.max(0, projectCount - 1);

    const snapToNearest = (offset: number) => {
      // Calculate nearest snap point (each project = 1 unit)
      const nearestSnap = Math.round(offset);
      const clampedSnap = Math.max(0, Math.min(maxScroll, nearestSnap));

      targetOffsetRef.current = clampedSnap;
      isSnappingRef.current = true;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Cancel any pending snap
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      isSnappingRef.current = false;

      setDetailScrollOffset((prev) => {
        const delta = e.deltaY * 0.003;
        const newOffset = prev + delta;
        return Math.max(0, Math.min(maxScroll, newOffset));
      });

      // Snap after user stops scrolling (150ms debounce)
      scrollTimeoutRef.current = setTimeout(() => {
        setDetailScrollOffset((current) => {
          snapToNearest(current);
          return current;
        });
      }, 150);
    };

    // Keyboard navigation for snap points
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const direction = e.key === "ArrowDown" ? 1 : -1;
        const currentSnap = Math.round(targetOffsetRef.current || detailScrollOffset);
        const nextSnap = Math.max(0, Math.min(maxScroll, currentSnap + direction));

        targetOffsetRef.current = nextSnap;
        isSnappingRef.current = true;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [selectedExperience, detailScrollOffset]);

  const handleBackToTimeline = useCallback(() => {
    setSelectedExperience(null);
    setDetailScrollOffset(0);
  }, []);

  // Portfolio scroll ref and handler for going back to previous section
  const portfolioScrollRef = useRef<HTMLDivElement>(null);
  const portfolioScrollAccumulator = useRef(0);

  useEffect(() => {
    if (section !== 11) {
      portfolioScrollAccumulator.current = 0;
      return;
    }

    const handlePortfolioWheel = (e: WheelEvent) => {
      const container = portfolioScrollRef.current;
      if (!container) return;

      // If scrolling up and at the top
      if (e.deltaY < 0 && container.scrollTop <= 0) {
        e.preventDefault();
        portfolioScrollAccumulator.current += Math.abs(e.deltaY);

        // Threshold to go back (need to scroll up ~100px worth)
        if (portfolioScrollAccumulator.current > 100) {
          portfolioScrollAccumulator.current = 0;
          navigateToSection(10);
        }
      } else {
        portfolioScrollAccumulator.current = 0;
      }
    };

    window.addEventListener("wheel", handlePortfolioWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handlePortfolioWheel);
    };
  }, [section, navigateToSection]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Animation variants for language change
  const langTextVariants: Variants = {
    initial: { opacity: 0, y: 10, filter: "blur(4px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(4px)",
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const langItemVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
  };

  // Section 0 is now the hero intro screen (centered)
  // Determine text position based on 3D element location
  // Position text on opposite side of 3D element for visibility
  const getTextPosition = () => {
    switch (section) {
      case 0:
        return "center"; // Hero intro - centered
      case 1:
        return "right"; // Frontend - left, text right
      case 2:
        return "left"; // Backend - center, text left
      case 3:
        return "left"; // Database - top, text left
      case 4:
        return "right"; // Mobile - text right
      case 5:
        return "right"; // Backoffice - text right
      case 6:
        return "left"; // CI/CD - text left
      case 7:
        return "left"; // Cloud - text left
      case 8:
        return "right"; // Testing - text right
      case 9:
        return "left"; // Overview - card left, 3D elements shift right
      default:
        return "left";
    }
  };

  const textPosition = getTextPosition();
  const positionClass =
    textPosition === "left"
      ? "justify-start pl-12 md:pl-20"
      : textPosition === "right"
        ? "justify-end pr-12 md:pr-20"
        : "justify-center";

  // Content for each section - aligned with 3D camera sequence
  const sectionContent: Record<
    number,
    { title: string; subtitle: string; category: string; items?: string[] }
  > = {
    0: {
      title: t("home.name"),
      subtitle: t("cards.hero.title"),
      category: t("sections.introduction"),
      items: [
        t("content.intro.passionateDev"),
        t("content.intro.customSolutions"),
        t("content.intro.fromConceptToDeployment"),
      ],
    },
    1: {
      title: t("content.frontend.title"),
      subtitle: t("content.frontend.subtitle"),
      category: t("sections.interface"),
      items: t("content.frontend.items", { returnObjects: true }) as string[],
    },
    2: {
      title: t("content.backend.title"),
      subtitle: t("content.backend.subtitle"),
      category: t("sections.server"),
      items: t("content.backend.items", { returnObjects: true }) as string[],
    },
    3: {
      title: t("content.database.title"),
      subtitle: t("content.database.subtitle"),
      category: t("sections.data"),
      items: t("content.database.items", { returnObjects: true }) as string[],
    },
    4: {
      title: t("content.mobile.title"),
      subtitle: t("content.mobile.subtitle"),
      category: t("sections.mobile"),
      items: t("content.mobile.items", { returnObjects: true }) as string[],
    },
    5: {
      title: t("content.backoffice.title"),
      subtitle: t("content.backoffice.subtitle"),
      category: t("sections.administration"),
      items: t("content.backoffice.items", { returnObjects: true }) as string[],
    },
    6: {
      title: t("content.cicd.title"),
      subtitle: t("content.cicd.subtitle"),
      category: t("sections.pipeline"),
      items: t("content.cicd.items", { returnObjects: true }) as string[],
    },
    7: {
      title: t("content.cloud.title"),
      subtitle: t("content.cloud.subtitle"),
      category: t("sections.hosting"),
      items: t("content.cloud.items", { returnObjects: true }) as string[],
    },
    8: {
      title: t("content.testing.title"),
      subtitle: t("content.testing.subtitle"),
      category: t("sections.quality"),
      items: t("content.testing.items", { returnObjects: true }) as string[],
    },
    9: {
      title: t("content.fullstack.title"),
      subtitle: t("content.fullstack.subtitle"),
      category: t("sections.overview"),
      items: t("content.fullstack.items", { returnObjects: true }) as string[],
    },
    10: {
      title: t("content.experience.title"),
      subtitle: t("content.experience.subtitle"),
      category: t("sections.timelineSection"),
      items: t("content.experience.items", { returnObjects: true }) as string[],
    },
    11: {
      title: t("portfolio.heading"),
      subtitle: t("portfolio.subtitle"),
      category: t("portfolio.title"),
      items: [
        t("portfolio.projects.novaFashion.title"),
        t("portfolio.projects.pulseAnalytics.title"),
        t("portfolio.projects.swiftDelivery.title"),
      ],
    },
  };

  const content = sectionContent[section] || sectionContent[0];

  return (
    <main className="w-full h-screen bg-gradient-to-b from-[#0a192f] via-[#0d2847] to-[#164e63] relative overflow-hidden">
      <Scene
        onSectionChange={setSection}
        onExperienceSelect={setSelectedExperience}
        selectedExperienceId={selectedExperience?.id || null}
        detailScrollOffset={detailScrollOffset}
        targetSection={targetSection}
        onNavigationComplete={handleNavigationComplete}
      />

      {/* Back button - shown when in detail view */}
      <AnimatePresence>
        {selectedExperience && section === 10 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackToTimeline}
            className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">{t("sections.back")}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Top Navigation Menu */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo/Name */}
          <motion.div
            className="text-white/90 font-bold text-lg tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            EW
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <motion.button
              onClick={() => navigateToSection(1)}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${
                section >= 1 && section <= 9
                  ? "text-cyan-400"
                  : "text-white/70 hover:text-cyan-400"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("nav.skills")}
              {section >= 1 && section <= 9 && (
                <motion.div
                  layoutId="nav-indicator"
                  className="h-0.5 bg-cyan-400 mt-1 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => navigateToSection(10)}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${
                section === 10
                  ? "text-cyan-400"
                  : "text-white/70 hover:text-cyan-400"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("nav.experience")}
              {section === 10 && (
                <motion.div
                  layoutId="nav-indicator"
                  className="h-0.5 bg-cyan-400 mt-1 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => navigateToSection(11)}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${
                section === 11
                  ? "text-cyan-400"
                  : "text-white/70 hover:text-cyan-400"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("nav.portfolio")}
              {section === 11 && (
                <motion.div
                  layoutId="nav-indicator"
                  className="h-0.5 bg-cyan-400 mt-1 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>

            {/* Language Switcher integrated in nav */}
            <div className="relative ml-4">
              <motion.button
                className="group flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => changeLanguage(i18n.language === "fr" ? "en" : "fr")}
              >
                <svg
                  className="w-4 h-4 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.6 9h16.8M3.6 15h16.8"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z"
                  />
                </svg>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={i18n.language}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium text-white/90 min-w-[24px]"
                  >
                    {i18n.language === "fr" ? "FR" : "EN"}
                  </motion.span>
                </AnimatePresence>
                <svg
                  className="w-3 h-3 text-white/40 group-hover:text-cyan-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Section Progress Indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-50">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              section === i
                ? "h-6 bg-cyan-400"
                : section > i
                  ? "h-2 bg-cyan-400/50"
                  : "h-2 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Hero Intro Screen - Section 0 */}
      <AnimatePresence>
        {section === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 w-full h-full z-20 pointer-events-none flex flex-col items-center justify-center"
          >
            <div
              style={{
                filter:
                  "drop-shadow(0 0 60px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 120px rgba(6, 182, 212, 0.3))",
              }}
            >
              <ParticleText
                text="Eden Wisniewski"
                fontSize={80}
                mouseRadius={120}
              />
            </div>

            <div
              className="mt-4"
              style={{ textShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
            >
              <Text text={t("sections.letsGoReal")} size="s" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="mt-12 flex flex-col items-center"
            >
              <span className="text-white/50 text-sm mb-2">
                {t("sections.scrollToExplore")}
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
              >
                <motion.div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Overlay - Position alternates (hidden on section 0 and 11) */}
      {section > 0 && section !== 11 && (targetSection === null || showCard) && (
        <div
          className={`absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center ${positionClass}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${section}-${i18n.language}-${showCard}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94] // Custom ease for smooth entrance
                }
              }}
              exit={{ opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } }}
              className="max-w-lg"
            >
              <div className="backdrop-blur-md bg-black/40 px-8 py-8 rounded-2xl border border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`cat-${i18n.language}`}
                    variants={langTextVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="block text-xs font-mono text-cyan-400/70 uppercase tracking-wider"
                  >
                    {content.category}
                  </motion.span>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`title-${i18n.language}`}
                    variants={langTextVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tight"
                  >
                    {content.title}
                  </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`sub-${i18n.language}`}
                    variants={langTextVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-xl text-cyan-400 mt-1 font-medium"
                  >
                    {content.subtitle}
                  </motion.h2>
                </AnimatePresence>

                {content.items && (
                  <AnimatePresence mode="wait">
                    <motion.ul
                      key={`items-${i18n.language}`}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="mt-6 space-y-2"
                    >
                      {content.items.map((item, i) => (
                        <motion.li
                          key={`${i}-${i18n.language}`}
                          variants={langItemVariants}
                          custom={i}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                )}

                {section === 9 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all pointer-events-auto"
                  >
                    {t("home.cta")}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Portfolio Section - Section 11 */}
      <AnimatePresence>
        {section === 11 && (targetSection === null || showCard) && (
          <motion.div
            ref={portfolioScrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 overflow-y-auto pointer-events-auto"
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-sm" />

            <div className="relative min-h-screen px-4 sm:px-6 py-24">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-sm text-white/60">{t("portfolio.subtitle")}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
                    {t("portfolio.heading")}
                  </h1>
                  <p className="text-base text-white/50 max-w-xl mx-auto">
                    {t("portfolio.description")}
                  </p>
                </motion.div>

                {/* Projects */}
                <div className="space-y-6">
                  {/* Featured */}
                  <FeaturedProjectCard
                    project={projects[0]}
                    onClick={() => setSelectedProject(projects[0])}
                  />

                  {/* Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.slice(1).map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        onClick={() => setSelectedProject(project)}
                      />
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/10 p-8 md:p-12 text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-cyan-600/10" />
                    <div className="relative">
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">{t("portfolio.cta.title")}</h3>
                      <p className="text-white/50 mb-6 max-w-lg mx-auto">{t("portfolio.cta.description")}</p>
                      <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold rounded-xl text-white hover:scale-105 active:scale-95 transition-transform">
                        {t("portfolio.cta.button")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* Project pagination indicator when in detail view */}
      <AnimatePresence>
        {selectedExperience && section === 10 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3"
          >
            {selectedExperience.projects.map((_, i) => {
              const currentProject = Math.round(detailScrollOffset);
              const isActive = i === currentProject;
              const isPast = i < currentProject;

              return (
                <motion.button
                  key={i}
                  onClick={() => {
                    targetOffsetRef.current = i;
                    isSnappingRef.current = true;
                  }}
                  className={`relative w-3 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "h-8 bg-cyan-400"
                      : isPast
                        ? "h-3 bg-cyan-400/50"
                        : "h-3 bg-white/20 hover:bg-white/40"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              );
            })}

            {/* Project counter */}
            <div className="mt-2 text-xs text-white/50 font-mono">
              {Math.round(detailScrollOffset) + 1}/{selectedExperience.projects.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint when in detail view */}
      <AnimatePresence>
        {selectedExperience &&
          section === 10 &&
          detailScrollOffset < 0.1 &&
          selectedExperience.projects.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-white/40"
            >
              <span className="text-xs mb-2">
                {t("sections.scrollToSeeProjects")}
              </span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </main>
  );
}
