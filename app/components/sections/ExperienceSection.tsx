import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Experience } from "../Timeline3D";
import type { MutableRefObject } from "react";

interface ExperienceSectionProps {
  section: number;
  selectedExperience: Experience | null;
  detailScrollOffset: number;
  targetOffsetRef: MutableRefObject<number>;
  isSnappingRef: MutableRefObject<boolean>;
  onBackToTimeline: () => void;
}

export function ExperienceSection({
  section,
  selectedExperience,
  detailScrollOffset,
  targetOffsetRef,
  isSnappingRef,
  onBackToTimeline,
}: ExperienceSectionProps) {
  const { t } = useTranslation("common");

  // Experience/Timeline is now section 10
  const isInExperienceSection = section === 10;

  return (
    <>
      {/* Back button - shown when in detail view */}
      <AnimatePresence>
        {selectedExperience && isInExperienceSection && (
          <motion.button
            initial={{ opacity: 0, x: -30, filter: "blur(5px)" }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              transition: { duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }
            }}
            exit={{
              opacity: 0,
              x: -20,
              filter: "blur(5px)",
              transition: { duration: 0.25 }
            }}
            onClick={onBackToTimeline}
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

      {/* Project pagination indicator when in detail view */}
      <AnimatePresence>
        {selectedExperience && isInExperienceSection && (
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(5px)" }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              transition: { duration: 0.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }
            }}
            exit={{
              opacity: 0,
              x: 20,
              filter: "blur(5px)",
              transition: { duration: 0.25 }
            }}
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
          isInExperienceSection &&
          detailScrollOffset < 0.1 &&
          selectedExperience.projects.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }
              }}
              exit={{
                opacity: 0,
                y: 10,
                transition: { duration: 0.2 }
              }}
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
    </>
  );
}
