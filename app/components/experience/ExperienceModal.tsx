import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type {
  Experience,
  Project,
  ProjectDetails,
  ProjectArchitecture,
  ProjectFeature,
} from "../Timeline3D";
import { MorphingText } from "../ui";
import { useTranslatedProjects } from "~/hooks";

// Mapping des dates pour les projets Atecna
const ATECNA_PROJECT_DATES: Record<string, string> = {
  "OPPBTP : PreventionBTP v3": "18 mois • 2024-2025",
  "Au Vieux Campeur - App Mobile v2": "3 mois • 2025-2026",
  "OPPBTP : Bonnes Pratiques Cordiste": "2 semaines • 2025",
  "GoCrisis - Gestion de Crise": "2 mois • 2024",
  "Catalina - Fidélité Gamifiée Retail": "6 mois • 2022-2025",
  "Elistair - Portail Client Drones": "6 mois • 2024",
  "Beager - Plateforme Freelance v2": "6 mois • 2023",
};

// Mapping des projets ayant une page portfolio dédiée
const PORTFOLIO_PROJECT_IDS: Record<string, string> = {
  "Tchee - Application VTC": "tchee",
  "SayYes - Portfolio & Landing Builder": "sayyes",
};

interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
}

// Composant pour afficher une carte de projet en aperçu
function ProjectCard({
  project,
  experienceColor,
  isSelected,
  onClick,
  hasDetails,
}: {
  project: Project;
  experienceColor: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  hasDetails: boolean;
}) {
  return (
    <motion.div
      onClick={onClick}
      className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-white/30 bg-white/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
      }`}
      style={{
        boxShadow: isSelected ? `0 0 30px ${experienceColor}30` : undefined,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-0.5 rounded-full opacity-60"
        style={{ background: experienceColor }}
      />

      {/* Project name */}
      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 flex items-center gap-2">
        {project.name}
        {hasDetails && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{
              background: `${experienceColor}20`,
              color: experienceColor,
            }}
          >
            Détails
          </span>
        )}
      </h4>

      {/* Description */}
      <p className="text-white/60 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Technologies - limité à 6 en aperçu */}
      <div className="flex flex-wrap gap-2">
        {project.tech.slice(0, 6).map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md text-xs border transition-colors"
            style={{
              borderColor: `${experienceColor}40`,
              color: experienceColor,
              background: `${experienceColor}15`,
            }}
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 6 && (
          <span className="px-2.5 py-1 rounded-md text-xs text-white/40">
            +{project.tech.length - 6}
          </span>
        )}
      </div>

      {/* Hover indicator */}
      {hasDetails && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white/40 text-xs">
          <span>Voir détails</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

// Composant pour afficher une section d'architecture
function ArchitectureSection({
  section,
  color,
  index,
}: {
  section: ProjectArchitecture;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className="bg-white/5 rounded-xl p-5 border border-white/10"
    >
      <h5
        className="text-sm font-bold uppercase tracking-wider mb-3"
        style={{ color }}
      >
        {section.title}
      </h5>
      <ul className="space-y-2">
        {section.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Composant pour afficher une feature
function FeatureCard({
  feature,
  index,
}: {
  feature: ProjectFeature;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors"
    >
      <div className="flex items-start gap-3">
        {feature.icon && (
          <span className="text-2xl shrink-0">{feature.icon}</span>
        )}
        <div>
          <h6 className="text-sm font-bold text-white mb-1">{feature.title}</h6>
          <p className="text-xs text-white/60 leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Vue détaillée d'un projet - Version enrichie
function ProjectDetailView({
  project,
  color,
  onBack,
  t,
}: {
  project: Project;
  color: string;
  onBack: () => void;
  t: (key: string) => string;
}) {
  const details = project.details as ProjectDetails;
  const portfolioId = PORTFOLIO_PROJECT_IDS[project.name];

  // Handler pour ouvrir le projet dans le portfolio
  const handleOpenInPortfolio = () => {
    if (portfolioId) {
      window.dispatchEvent(
        new CustomEvent("openPortfolioProject", {
          detail: { projectId: portfolioId },
        })
      );
    }
  };

  // Variantes d'animation pour les éléments
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full flex flex-col"
    >
      {/* Header avec bouton retour et ligne décorative */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4 mb-6"
      >
        <motion.button
          onClick={onBack}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm border border-transparent hover:border-white/10"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
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
          {t("experience.back")}
        </motion.button>
        <motion.div
          className="flex-1 h-px"
          style={{
            background: `linear-gradient(to right, ${color}40, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* Bouton vers le portfolio si le projet a une page dédiée */}
        {portfolioId && (
          <motion.button
            onClick={handleOpenInPortfolio}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={{
              background: `${color}15`,
              borderColor: `${color}40`,
              color: color,
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {t("experience.viewInPortfolio")}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        )}
      </motion.div>

      {/* Contenu scrollable */}
      <motion.div
        className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section - Titre et overview */}
        <motion.div variants={itemVariants} className="relative">
          {/* Gradient accent */}
          <div
            className="absolute -left-4 top-0 bottom-0 w-1 rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${color}, ${color}00)`,
            }}
          />

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {project.name}
          </h3>

          {/* Description courte avec style citation */}
          <div
            className="relative pl-4 py-2 border-l-2 mb-4"
            style={{ borderColor: `${color}60` }}
          >
            <p className="text-white/60 text-sm italic">{project.description}</p>
          </div>

          {/* Overview détaillée */}
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-5 border border-white/10">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}20` }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">
                  {t("experience.details")}
                </h4>
                <p className="text-white/70 leading-relaxed text-sm">
                  {details.overview}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Métriques avec animations */}
        {details.metrics && details.metrics.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {details.metrics.map((metric, i) => (
                <motion.div
                  key={i}
                  variants={scaleVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="relative group text-center p-4 rounded-xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                >
                  {/* Background glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${color}15 0%, transparent 70%)`,
                    }}
                  />

                  <motion.div
                    className="relative text-2xl md:text-3xl font-bold mb-1"
                    style={{ color }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                  >
                    {metric.value}
                  </motion.div>
                  <div className="relative text-xs text-white/50 uppercase tracking-wider font-medium">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Technologies - Stack complète */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}20` }}
            >
              <svg
                className="w-4 h-4"
                style={{ color }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h4
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color }}
            >
              {t("experience.stackTechnique")}
            </h4>
            <div
              className="flex-1 h-px"
              style={{ background: `${color}20` }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className="px-3 py-1.5 rounded-lg text-sm border cursor-default transition-all hover:shadow-lg"
                style={{
                  borderColor: `${color}40`,
                  color: color,
                  background: `${color}10`,
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Architecture - Cartes détaillées */}
        {details.architecture && details.architecture.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color }}
              >
                {t("experience.architecture")}
              </h4>
              <div
                className="flex-1 h-px"
                style={{ background: `${color}20` }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {details.architecture.map((section, i) => (
                <ArchitectureSection
                  key={section.title}
                  section={section}
                  color={color}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Fonctionnalités - Grid enrichie */}
        {details.features && details.features.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color }}
              >
                {t("experience.keyFeatures")}
              </h4>
              <div
                className="flex-1 h-px"
                style={{ background: `${color}20` }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {details.features.map((feature, i) => (
                <FeatureCard
                  key={feature.title}
                  feature={feature}
                  color={color}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Défis techniques - Timeline style */}
        {details.challenges && details.challenges.length > 0 && (
          <motion.div variants={itemVariants} className="pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color }}
              >
                {t("experience.technicalChallenges")}
              </h4>
              <div
                className="flex-1 h-px"
                style={{ background: `${color}20` }}
              />
            </div>

            <div className="relative">
              {/* Ligne verticale connectrice */}
              <div
                className="absolute left-3 top-6 bottom-6 w-0.5 rounded-full"
                style={{ background: `${color}30` }}
              />

              <ul className="space-y-3">
                {details.challenges.map((challenge, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="group relative flex items-start gap-4 text-sm text-white/70 bg-gradient-to-r from-white/5 to-transparent rounded-xl p-4 border border-white/5 hover:border-white/15 hover:bg-white/8 transition-all cursor-default"
                  >
                    {/* Numéro connecté à la ligne */}
                    <span
                      className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform group-hover:scale-110"
                      style={{
                        background: color,
                        color: "#000",
                        boxShadow: `0 0 12px ${color}50`,
                      }}
                    >
                      {i + 1}
                    </span>

                    <span className="pt-0.5 leading-relaxed group-hover:text-white/90 transition-colors">
                      {challenge}
                    </span>

                    {/* Flèche indicatrice au hover */}
                    <svg
                      className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-60 transition-opacity shrink-0 mt-1"
                      style={{ color }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Gradient de fondu en bas pour indiquer le scroll */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
        }}
      />
    </motion.div>
  );
}

function YearMarker({
  year,
  isActive,
  color,
  index,
}: {
  year: number;
  isActive: boolean;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
      className="flex items-center gap-3"
    >
      {/* Year label */}
      <span
        className={`text-sm font-mono transition-colors ${
          isActive ? "text-white font-bold" : "text-white/40"
        }`}
      >
        {year}
      </span>

      {/* Dot */}
      <div
        className={`w-3 h-3 rounded-full border-2 transition-all ${
          isActive ? "scale-125" : "scale-100"
        }`}
        style={{
          borderColor: isActive ? color : "rgba(255,255,255,0.3)",
          background: isActive ? color : "transparent",
          boxShadow: isActive ? `0 0 10px ${color}` : undefined,
        }}
      />
    </motion.div>
  );
}

export function ExperienceModal({ experience, onClose }: ExperienceModalProps) {
  const { t } = useTranslation("common");
  const { translateProjects } = useTranslatedProjects();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Refs pour synchroniser le scroll entre gauche et droite
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<"left" | "right" | null>(null);

  // Traduire les projets
  const translatedProjects = useMemo(
    () => translateProjects(experience.projects),
    [experience.projects, translateProjects]
  );

  // Synchroniser le scroll entre les deux panneaux
  const handleScroll = useCallback((source: "left" | "right") => {
    if (isScrollingRef.current && isScrollingRef.current !== source) return;

    const leftEl = leftScrollRef.current;
    const rightEl = rightScrollRef.current;

    if (!leftEl || !rightEl) return;

    isScrollingRef.current = source;

    const sourceEl = source === "left" ? leftEl : rightEl;
    const targetEl = source === "left" ? rightEl : leftEl;

    // Calculer le ratio de scroll
    const scrollRatio = sourceEl.scrollTop / (sourceEl.scrollHeight - sourceEl.clientHeight || 1);
    const targetScrollTop = scrollRatio * (targetEl.scrollHeight - targetEl.clientHeight);

    targetEl.scrollTop = targetScrollTop;

    // Reset après un court délai
    requestAnimationFrame(() => {
      isScrollingRef.current = null;
    });
  }, []);

  // Generate years for the timeline
  const startYear = Math.floor(experience.startYear);
  const endYear = experience.endYear
    ? Math.ceil(experience.endYear)
    : new Date().getFullYear();
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const isEducation = experience.isEducation;
  const selectedProject =
    selectedProjectIndex !== null
      ? translatedProjects[selectedProjectIndex]
      : null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDetailView) {
          setShowDetailView(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, showDetailView]);

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" as const },
    },
  };

  const handleProjectClick = (index: number) => {
    const project = translatedProjects[index];
    setSelectedProjectIndex(index);
    if (project.details) {
      setShowDetailView(true);
    }
  };

  const handleBackToList = () => {
    setShowDetailView(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
        onClick={showDetailView ? handleBackToList : onClose}
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Modal content */}
      <motion.div
        className="relative w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-2xl overflow-hidden bg-gray-900/95 md:border border-white/10"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
          mass: 0.8,
        }}
      >
        {/* Top accent bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{ background: experience.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xl flex items-center justify-center transition-colors border border-white/10"
          initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>

        {/* Main layout */}
        <div className="h-full flex flex-col">
          {/* Header - Extracted to top of modal */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="shrink-0 px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-white/10 md:pr-20"
          >
            <div className="flex items-start justify-between">
              <div>
                {/* Badge Formation/Expérience */}
                {isEducation && (
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2"
                    style={{
                      background: `${experience.color}30`,
                      color: experience.color,
                    }}
                  >
                    <MorphingText>{t("experience.education")}</MorphingText>
                  </span>
                )}
                <h2 className="text-2xl font-bold text-white mb-1">
                  <MorphingText>
                    {experience.id === "etude"
                      ? t("experience.study")
                      : experience.company}
                  </MorphingText>
                </h2>
                <p className="text-sm text-white/60">{experience.role}</p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-medium"
                  style={{ color: experience.color }}
                >
                  {experience.period}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {translatedProjects.length}{" "}
                  {translatedProjects.length > 1
                    ? t("experience.projectCountPlural")
                    : t("experience.projectCount")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content area */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <AnimatePresence mode="wait">
              {showDetailView && selectedProject?.details ? (
                <motion.div
                  key="detail"
                  className="flex-1 overflow-hidden p-6 md:p-8"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <ProjectDetailView
                    project={selectedProject}
                    color={experience.color}
                    onBack={handleBackToList}
                    t={t}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  className="flex-1 flex flex-col md:flex-row overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Left side - Timeline dates for Atecna */}
                  {experience.id === "atecna" && (
                    <motion.div
                      className="hidden md:block w-56 shrink-0 border-r border-white/10 bg-black/20"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <div
                        ref={leftScrollRef}
                        className="h-full overflow-y-auto scrollbar-none p-4"
                        onScroll={() => handleScroll("left")}
                      >
                        <div className="flex flex-col gap-4">
                          {experience.projects.map((project, index) => {
                            const projectDate = ATECNA_PROJECT_DATES[project.name];
                            return (
                              <motion.div
                                key={project.name}
                                data-index={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                                className={`relative pl-4 pr-2 py-4 border-l-2 transition-all cursor-pointer hover:bg-white/5 rounded-r-lg flex flex-col justify-center`}
                                style={{
                                  minHeight: "160px",
                                  borderLeftColor: selectedProjectIndex === index ? experience.color : "rgba(255,255,255,0.2)",
                                  backgroundColor: selectedProjectIndex === index ? "rgba(255,255,255,0.05)" : undefined,
                                }}
                                onClick={() => {
                                  setSelectedProjectIndex(index);
                                  const proj = translatedProjects[index];
                                  if (proj?.details) {
                                    setShowDetailView(true);
                                  }
                                }}
                              >
                                {/* Date badge */}
                                {projectDate && (
                                  <span
                                    className="text-[11px] font-bold uppercase tracking-wider mb-2 block"
                                    style={{ color: experience.color }}
                                  >
                                    {projectDate}
                                  </span>
                                )}
                                {/* Project name */}
                                <p className={`text-xs leading-snug transition-colors font-medium ${
                                  selectedProjectIndex === index ? "text-white" : "text-white/60"
                                }`}>
                                  {project.name}
                                </p>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Left side - Years timeline for other experiences */}
                  {experience.id !== "atecna" && (
                    <motion.div
                      className="hidden md:block w-48 shrink-0 p-6 border-r border-white/10 bg-black/20"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <div className="relative">
                        {/* Vertical line */}
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          exit={{ scaleY: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="absolute left-[4.75rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 via-white/10 to-transparent origin-top"
                          style={{ height: `${years.length * 40}px` }}
                        />

                        {/* Arrow at the bottom */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          className="absolute left-[4.25rem] -bottom-2"
                          style={{ top: `${years.length * 40 - 8}px` }}
                        >
                          <svg
                            className="w-4 h-4 text-white/30"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 16l-6-6h12z" />
                          </svg>
                        </motion.div>

                        {/* Year markers */}
                        <motion.div
                          className="flex flex-col gap-6"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {years.map((year, index) => (
                            <YearMarker
                              key={year}
                              year={year}
                              isActive={year === startYear || year === endYear}
                              color={experience.color}
                              index={index}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Right side - Projects */}
                  <motion.div
                    className="flex-1 overflow-hidden p-6 md:p-8"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <div className="h-full flex flex-col">
                      {/* Projects grid */}
                      <div
                        ref={experience.id === "atecna" ? rightScrollRef : undefined}
                        className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4"
                        onScroll={experience.id === "atecna" ? () => handleScroll("right") : undefined}
                      >
                        {translatedProjects.map((project, index) => (
                          <motion.div
                            key={index}
                            data-index={index}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <ProjectCard
                              project={project}
                              experienceColor={experience.color}
                              index={index}
                              isSelected={selectedProjectIndex === index}
                              onClick={() => handleProjectClick(index)}
                              hasDetails={!!project.details}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
