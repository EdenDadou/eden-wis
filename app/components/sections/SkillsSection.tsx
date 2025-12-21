import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { langTextVariants, langItemVariants, getTextPosition, getPositionClass } from "../../constants";
import { useSectionContent } from "../../hooks";

interface SkillsSectionProps {
  section: number;
  showCard: boolean;
  targetSection: number | null;
  isFirstCardReady: boolean;
  isNavigating: boolean;
  onBackToSkillsMenu?: () => void;
}

export function SkillsSection({ section, showCard, targetSection, isFirstCardReady, isNavigating, onBackToSkillsMenu }: SkillsSectionProps) {
  const { t, i18n } = useTranslation("common");
  const textPosition = getTextPosition(section);
  const positionClass = getPositionClass(textPosition);
  const content = useSectionContent(section);

  // Determine if this is the first skill section (coming from hero)
  const isFirstSection = section === 1;

  // Determine if this is a group slide section (2, 6, 9) - these get special treatment
  const isGroupSlide = section === 2 || section === 6 || section === 9;

  // Determine if we're in a detail skill section (not overview, not group slides)
  // These are sections 3, 4, 5 (Frontend details), 7, 8 (Backend details), 10, 11, 12 (DevOps details)
  const isDetailSection = section >= 3 && section <= 12 && !isGroupSlide;

  // Calculate entrance direction based on position
  // Cards slide in from the opposite side of where they'll end up
  const getEntranceX = () => {
    if (isFirstSection) return 0; // First section slides up from bottom
    if (textPosition === "left") return "-100%";  // Slide in from left
    if (textPosition === "right") return "100%";  // Slide in from right
    return 0;
  };

  // Check if we're in skills section range
  const isInSkillsRange = section > 0 && section < 13;

  // Card should be visible when in skills range, ready, and not navigating
  const shouldShowCard = isInSkillsRange && (targetSection === null || showCard) && (!isFirstSection || isFirstCardReady) && !isNavigating;

  return (
    <div
      className={`absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center ${positionClass}`}
    >
      <AnimatePresence mode="wait">
        {shouldShowCard && (
          <motion.div
            key={`${section}-${i18n.language}`}
            initial={{
              opacity: 0,
              x: getEntranceX(),
              y: isFirstSection ? "50vh" : 20,
              scale: 0.9,
              filter: "blur(10px)"
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: {
                duration: isFirstSection ? 0.8 : isGroupSlide ? 0.7 : 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1, // Small delay after navigation completes
                filter: { duration: 0.4 }
              }
            }}
            exit={{
              opacity: 0,
              x: textPosition === "left" ? "-50%" : textPosition === "right" ? "50%" : 0,
              y: isFirstSection ? "30vh" : -20,
              scale: 0.9,
              filter: "blur(8px)",
              transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
            }}
            className="max-w-lg"
          >
          {/* Back arrow for detail sections */}
          {isDetailSection && onBackToSkillsMenu && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToSkillsMenu}
              className="flex items-center gap-2 mb-4 text-cyan-400 hover:text-cyan-300 transition-colors pointer-events-auto group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{t("skills.backToMenu", "Compétences")}</span>
            </motion.button>
          )}

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
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}

            {section === 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all pointer-events-auto"
              >
                {t("home.cta")}
              </motion.button>
            )}
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
