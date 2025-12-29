import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { Experience, Project } from "../Timeline3D";
import { MorphingText } from "../ui";

interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
}

function ProjectCard({
  project,
  experienceColor,
  isSelected,
  onClick,
}: {
  project: Project;
  experienceColor: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
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
      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-white/90">
        {project.name}
      </h4>

      {/* Description */}
      <p className="text-white/60 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2">
        {project.tech.map((tech) => (
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
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5 text-white/40"
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
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  // Generate years for the timeline
  const startYear = Math.floor(experience.startYear);
  const endYear = experience.endYear ? Math.ceil(experience.endYear) : new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const isEducation = experience.isEducation;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

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
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" }
    },
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
        onClick={onClose}
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
        <div className="h-full flex flex-col md:flex-row">
          {/* Left side - Timeline with years */}
          <motion.div
            className="w-full md:w-48 shrink-0 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/30"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mb-8"
            >
              {/* Badge Formation/Expérience */}
              {isEducation && (
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2"
                  style={{ background: `${experience.color}30`, color: experience.color }}
                >
                  <MorphingText>
                    {t("experience.education")}
                  </MorphingText>
                </span>
              )}
              <h2 className="text-xl font-bold text-white mb-1">
                <MorphingText>
                  {experience.id === 'etude' ? t('experience.study') : experience.company}
                </MorphingText>
              </h2>
              <p className="text-sm text-white/60">{experience.role}</p>
              <p className="text-xs text-white/40 mt-1">{experience.period}</p>
            </motion.div>

            {/* Timeline arrow and years */}
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

          {/* Right side - Projects */}
          <motion.div
            className="flex-1 overflow-y-auto p-6 md:p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {/* Section title */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <h3
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: experience.color }}
              >
                <MorphingText>
                  {t("experience.projects")}
                </MorphingText>
              </h3>
              <motion.div
                className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                style={{ originX: 0 }}
              />
              <span className="text-xs text-white/30">
                {experience.projects.length} {experience.projects.length > 1 ? "projets" : "projet"}
              </span>
            </motion.div>

            {/* Projects grid */}
            <motion.div
              className="grid gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {experience.projects.map((project, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ProjectCard
                    project={project}
                    experienceColor={experience.color}
                    index={index}
                    isSelected={selectedProjectIndex === index}
                    onClick={() =>
                      setSelectedProjectIndex(
                        selectedProjectIndex === index ? null : index
                      )
                    }
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty state */}
            {experience.projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-center py-16"
              >
                <motion.div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `${experience.color}20` }}
                  animate={{
                    boxShadow: [
                      `0 0 0px ${experience.color}00`,
                      `0 0 20px ${experience.color}40`,
                      `0 0 0px ${experience.color}00`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: experience.color }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </motion.div>
                <p className="text-white/40 text-sm">
                  <MorphingText>
                    {t("experience.noProjects")}
                  </MorphingText>
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
