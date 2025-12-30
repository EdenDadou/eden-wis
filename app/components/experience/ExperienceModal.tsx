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
import PixelHeart from "../PixelHeart";

// Mapping des dates pour les projets par expérience
const PROJECT_DATES: Record<string, Record<string, string>> = {
  atecna: {
    "OPPBTP : PreventionBTP v3": "18 mois • 2024-2025",
    "Au Vieux Campeur - App Mobile v2": "3 mois • 2025-2026",
    "OPPBTP : Bonnes Pratiques Cordiste": "1 mois • 2025",
    "GoCrisis - Gestion de Crise": "3 mois • 2024",
    "Catalina - Fidélité Gamifiée Retail": "1 an • 2021-2025",
    "Elistair - Portail Client Drones": "10 mois • 2023-2024",
    "Beager - Plateforme Freelance v2": "6 mois • 2023",
    "Timtle - Location Immobilière": "6 mois • 2020-2021",
    "Cora Wine - E-commerce Vins": "6 mois • 2023",
    "Wipple - Réservation Salles": "2 mois • 2024",
  },
  freelance: {
    "Tchee - Application VTC": "8 mois • 2024-2025",
    "SayYes - Portfolio & Landing Builder": "3 mois • 2024",
    "Guardian - DeFi Smart Accounts": "1 mois • 2025",
  },
  etude: {
    "Projet de fin d'études": "4 mois • 2019",
    "Stage développeur": "3 mois • 2019",
  },
  e4ia: {
    "Projet 1": "6 mois • 2020",
  },
};

// Mapping des projets ayant une page portfolio dédiée
const PORTFOLIO_PROJECT_IDS: Record<string, string> = {
  "Tchee - Application VTC": "tchee",
  "SayYes - Portfolio & Landing Builder": "sayyes",
};

// Mapping des logos pour chaque expérience (entreprise)
const EXPERIENCE_LOGOS: Record<string, string> = {
  atecna: "/images/logos/atecna.jpeg",
};

// Mapping des logos pour chaque projet
const PROJECT_LOGOS: Record<string, string> = {
  "OPPBTP : PreventionBTP v3": "/images/logos/oppbtp-prevention.png",
  "Au Vieux Campeur - App Mobile v2": "/images/logos/auvieuxcampeur.svg",
  "OPPBTP : Bonnes Pratiques Cordiste":
    "/images/logos/oppbtp-bonnepratique.png",
  "GoCrisis - Gestion de Crise": "/images/logos/gocrisis.png",
  "Catalina - Fidélité Gamifiée Retail": "/images/logos/catalina.png",
  "Elistair - Portail Client Drones": "/images/logos/elistair.png",
  "Beager - Plateforme Freelance v2": "/images/logos/beager.png",
  "Timtle - Location Immobilière": "/images/logos/timtle.png",
  "Wipple - Réservation Salles": "/images/logos/wipple.png",
  "Cora Wine - E-commerce Vins": "/images/logos/corawine.png",
  "Tchee - Application VTC": "/images/logos/tchee.png",
  "SayYes - Portfolio & Landing Builder": "/images/logos/sayyes.svg",
  "Guardian - DeFi Smart Accounts": "/images/logos/guardian.png",
};

interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
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
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: color }}
            />
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
            <p className="text-white/60 text-sm italic">
              {project.description}
            </p>
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
            <div className="flex-1 h-px" style={{ background: `${color}20` }} />
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

export function ExperienceModal({ experience, onClose }: ExperienceModalProps) {
  const { t } = useTranslation("common");
  const { translateProjects } = useTranslatedProjects();
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(
    null
  );
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Ref pour le container scrollable
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Traduire les projets
  const translatedProjects = useMemo(
    () => translateProjects(experience.projects),
    [experience.projects, translateProjects]
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
        className="absolute inset-0 bg-black/50 backdrop-blur-lg"
        onClick={showDetailView ? handleBackToList : onClose}
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Logo EW - Floating above backdrop, clickable to close */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 left-6 flex items-center gap-2 text-white/90 font-bold text-lg tracking-tight cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PixelHeart size={20} />
        EW
      </motion.button>

      {/* Modal content */}
      <motion.div
        className="relative w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(17,17,23,0.85) 0%, rgba(10,10,14,0.9) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ opacity: 0, scale: 0.92, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 350,
          mass: 0.9,
        }}
      >
        {/* Outer glow effect */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none hidden md:block"
          style={{
            background: `linear-gradient(135deg, ${experience.color}30, transparent 40%, transparent 60%, ${experience.color}20)`,
            padding: '1px',
          }}
        />

        {/* Border */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none hidden md:block"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `0 0 80px ${experience.color}15, 0 25px 50px -12px rgba(0,0,0,0.8)`,
          }}
        />

        {/* Top accent bar with glow */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px] z-10"
          style={{
            background: `linear-gradient(to right, transparent, ${experience.color}, transparent)`,
            boxShadow: `0 0 20px ${experience.color}60, 0 0 40px ${experience.color}30`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        />

        {/* Corner accents */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${experience.color}10 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {/* Hover background */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${experience.color}20, transparent)`,
                border: `1px solid ${experience.color}30`,
              }}
            />
            <svg
              className="relative w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-300"
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
          </div>
        </motion.button>

        {/* Main layout */}
        <div className="h-full flex flex-col">
          {/* Header - Extracted to top of modal */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="shrink-0 px-6 md:px-8 pt-6 md:pt-8 pb-5 border-b border-white/5 md:pr-20 relative overflow-hidden"
          >
            {/* Background gradient decoration */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(ellipse 80% 50% at 20% 0%, ${experience.color}15 0%, transparent 50%)`,
              }}
            />

            <div className="relative flex items-start justify-between">
              <div>
                {/* Badge Formation/Expérience */}
                {isEducation && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                    style={{
                      background: `${experience.color}20`,
                      color: experience.color,
                      border: `1px solid ${experience.color}30`,
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <MorphingText>{t("experience.education")}</MorphingText>
                  </motion.span>
                )}

                <motion.div
                  className="flex items-center gap-3 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  {/* Logo de l'expérience */}
                  {EXPERIENCE_LOGOS[experience.id] && (
                    <motion.div
                      className="shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      style={{
                        boxShadow: `0 4px 20px ${experience.color}30`,
                      }}
                    >
                      <img
                        src={EXPERIENCE_LOGOS[experience.id]}
                        alt={`${experience.company} logo`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}

                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    <MorphingText>
                      {experience.id === "etude"
                        ? t("experience.study")
                        : experience.company}
                    </MorphingText>
                  </h2>
                </motion.div>

                <motion.p
                  className="text-sm text-white/50 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  {experience.role}
                </motion.p>
              </div>

              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {/* Period badge */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-2"
                  style={{
                    background: `${experience.color}15`,
                    border: `1px solid ${experience.color}25`,
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    style={{ color: experience.color }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span
                    className="text-sm font-bold"
                    style={{ color: experience.color }}
                  >
                    {experience.period}
                  </span>
                </div>

                {/* Project count */}
                <p className="text-xs text-white/40 flex items-center justify-end gap-1.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {translatedProjects.length}
                  </span>
                  {translatedProjects.length > 1
                    ? t("experience.projectCountPlural")
                    : t("experience.projectCount")}
                </p>
              </motion.div>
            </div>

            {/* Decorative bottom line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${experience.color}40, transparent)`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
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
                  className="flex-1 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Single scrollable container */}
                  <div
                    ref={scrollContainerRef}
                    className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                  >
                    <div className="flex flex-col gap-4 p-6 md:p-8 pb-12">
                      {translatedProjects.map((project, index) => {
                        const projectDate = PROJECT_DATES[experience.id]?.[experience.projects[index]?.name];
                        const isHovered = hoveredProjectIndex === index;
                        const hasProjectDates = !!PROJECT_DATES[experience.id];

                        // Extraire durée et années depuis projectDate
                        const dateParts = projectDate?.split(" • ") || [];
                        const duration = dateParts[0] || "";
                        const yearRange = dateParts[1] || "";

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.1 + index * 0.05,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="group cursor-pointer"
                            onMouseEnter={() => setHoveredProjectIndex(index)}
                            onMouseLeave={() => setHoveredProjectIndex(null)}
                            onClick={() => handleProjectClick(index)}
                          >
                            {/* Row container with 2 columns on desktop */}
                            <motion.div
                              className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                                hasProjectDates ? 'md:grid md:grid-cols-[280px_1fr]' : ''
                              }`}
                              animate={{
                                scale: isHovered ? 1.01 : 1,
                              }}
                              style={{
                                background: isHovered
                                  ? `linear-gradient(135deg, ${experience.color}08 0%, rgba(255,255,255,0.03) 100%)`
                                  : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                border: isHovered
                                  ? `1px solid ${experience.color}40`
                                  : '1px solid rgba(255,255,255,0.06)',
                                boxShadow: isHovered
                                  ? `0 20px 40px -15px ${experience.color}20, 0 0 0 1px ${experience.color}10`
                                  : '0 4px 20px -10px rgba(0,0,0,0.3)',
                              }}
                            >
                              {/* Top accent line */}
                              <motion.div
                                className="absolute top-0 left-0 right-0 h-[2px] z-10"
                                style={{
                                  background: `linear-gradient(to right, transparent, ${experience.color}, transparent)`,
                                }}
                                animate={{
                                  opacity: isHovered ? 1 : 0.3,
                                  scaleX: isHovered ? 1 : 0.5,
                                }}
                                transition={{ duration: 0.4 }}
                              />

                              {/* LEFT COLUMN - Date, Duration, Logo (only if hasProjectDates) */}
                              {hasProjectDates && (
                                <div
                                  className="hidden md:flex flex-col justify-center p-5 border-r transition-all duration-300"
                                  style={{
                                    borderColor: isHovered
                                      ? `${experience.color}20`
                                      : 'rgba(255,255,255,0.05)',
                                    background: isHovered
                                      ? `linear-gradient(135deg, ${experience.color}10 0%, transparent 100%)`
                                      : 'rgba(0,0,0,0.2)',
                                  }}
                                >
                                  {/* Logo */}
                                  {PROJECT_LOGOS[experience.projects[index]?.name] && (
                                    <motion.div
                                      className="mb-3"
                                      animate={{ y: isHovered ? -2 : 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <div
                                        className="inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-300"
                                        style={{
                                          background: 'rgba(255,255,255,0.95)',
                                          boxShadow: isHovered
                                            ? `0 8px 24px ${experience.color}25, 0 4px 8px rgba(0,0,0,0.2)`
                                            : '0 4px 12px rgba(0,0,0,0.15)',
                                        }}
                                      >
                                        <img
                                          src={PROJECT_LOGOS[experience.projects[index]?.name]}
                                          alt={`${project.name} logo`}
                                          className={`object-contain transition-all duration-300 ${
                                            experience.projects[index]?.name === "Au Vieux Campeur - App Mobile v2"
                                              ? "h-5 w-[120px]"
                                              : experience.projects[index]?.name === "Elistair - Portail Client Drones"
                                                ? "max-h-6 max-w-[90px]"
                                                : ["GoCrisis - Gestion de Crise", "Cora Wine - E-commerce Vins", "Wipple - Réservation Salles"].includes(experience.projects[index]?.name || "")
                                                  ? "max-h-8 max-w-[140px]"
                                                  : "max-h-7 max-w-[100px]"
                                          }`}
                                          style={{
                                            filter: isHovered ? "none" : "grayscale(15%)",
                                            opacity: isHovered ? 1 : 0.9,
                                          }}
                                        />
                                      </div>
                                    </motion.div>
                                  )}

                                  {/* Duration & Year badges */}
                                  {projectDate && (
                                    <div className="flex flex-wrap items-center gap-2">
                                      <motion.span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                        style={{
                                          background: isHovered ? `${experience.color}25` : 'rgba(255,255,255,0.08)',
                                          color: isHovered ? experience.color : 'rgba(255,255,255,0.6)',
                                          border: `1px solid ${isHovered ? experience.color + '40' : 'transparent'}`,
                                        }}
                                        animate={{ scale: isHovered ? 1.03 : 1 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {duration}
                                      </motion.span>
                                      <span
                                        className="text-[10px] font-medium tracking-wide transition-colors duration-300"
                                        style={{ color: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}
                                      >
                                        {yearRange}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* RIGHT COLUMN - Project info */}
                              <div className="relative p-5 flex flex-col">
                                {/* Glow effect */}
                                <motion.div
                                  className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl pointer-events-none"
                                  style={{ background: experience.color }}
                                  animate={{
                                    opacity: isHovered ? 0.12 : 0,
                                    scale: isHovered ? 1 : 0.5,
                                  }}
                                  transition={{ duration: 0.4 }}
                                />

                                {/* Mobile: Show date info inline */}
                                {hasProjectDates && projectDate && (
                                  <div className="md:hidden flex items-center gap-2 mb-3">
                                    {PROJECT_LOGOS[experience.projects[index]?.name] && (
                                      <div className="shrink-0 bg-white rounded-lg p-1.5">
                                        <img
                                          src={PROJECT_LOGOS[experience.projects[index]?.name]}
                                          alt=""
                                          className="h-5 w-auto object-contain"
                                        />
                                      </div>
                                    )}
                                    <span
                                      className="text-[10px] font-bold uppercase tracking-wider"
                                      style={{ color: experience.color }}
                                    >
                                      {duration} • {yearRange}
                                    </span>
                                  </div>
                                )}

                                {/* Header */}
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <motion.h4
                                    className="text-base font-bold text-white leading-snug flex-1"
                                    animate={{ color: isHovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.9)' }}
                                  >
                                    {project.name}
                                  </motion.h4>

                                  {project.details && (
                                    <motion.span
                                      className="shrink-0 flex items-center gap-1 text-[9px] px-2 py-1 rounded-full uppercase tracking-wider font-bold"
                                      style={{
                                        background: `${experience.color}20`,
                                        color: experience.color,
                                        border: `1px solid ${experience.color}30`,
                                      }}
                                      animate={{
                                        scale: isHovered ? 1.05 : 1,
                                        background: isHovered ? `${experience.color}30` : `${experience.color}20`,
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Détails
                                    </motion.span>
                                  )}
                                </div>

                                {/* Description */}
                                <p
                                  className="text-sm mb-4 leading-relaxed transition-colors duration-300"
                                  style={{ color: isHovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)' }}
                                >
                                  {project.description}
                                </p>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-1.5">
                                  {project.tech.slice(0, 6).map((tech, i) => (
                                    <motion.span
                                      key={tech}
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-300"
                                      style={{
                                        background: isHovered ? `${experience.color}15` : 'rgba(255,255,255,0.06)',
                                        color: isHovered ? experience.color : 'rgba(255,255,255,0.6)',
                                        border: `1px solid ${isHovered ? experience.color + '30' : 'rgba(255,255,255,0.08)'}`,
                                      }}
                                      animate={{ y: isHovered ? -1 : 0 }}
                                      transition={{ duration: 0.2, delay: i * 0.02 }}
                                    >
                                      {tech}
                                    </motion.span>
                                  ))}
                                  {project.tech.length > 6 && (
                                    <span
                                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                                      style={{ color: isHovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)' }}
                                    >
                                      +{project.tech.length - 6}
                                    </span>
                                  )}
                                </div>

                                {/* CTA indicator */}
                                {project.details && (
                                  <motion.div
                                    className="absolute bottom-4 right-4 flex items-center gap-1.5"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                      opacity: isHovered ? 1 : 0,
                                      x: isHovered ? 0 : -10,
                                    }}
                                    transition={{ duration: 0.25 }}
                                  >
                                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: experience.color }}>
                                      Explorer
                                    </span>
                                    <motion.svg
                                      className="w-4 h-4"
                                      style={{ color: experience.color }}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      animate={{ x: isHovered ? 3 : 0 }}
                                      transition={{ duration: 0.3, repeat: isHovered ? Infinity : 0, repeatType: "reverse" }}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </motion.svg>
                                  </motion.div>
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
