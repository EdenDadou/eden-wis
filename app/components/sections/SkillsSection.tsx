import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { langTextVariants, langItemVariants, getTextPosition, getPositionClass } from "../../constants";
import { useSectionContent } from "../../hooks";

interface SkillsSectionProps {
  section: number;
  showCard: boolean;
  targetSection: number | null;
  isFirstCardReady: boolean;
}

export function SkillsSection({ section, showCard, targetSection, isFirstCardReady }: SkillsSectionProps) {
  const { t, i18n } = useTranslation("common");
  const textPosition = getTextPosition(section);
  const positionClass = getPositionClass(textPosition);
  const content = useSectionContent(section);

  // Determine if this is the first skill section (coming from hero)
  const isFirstSection = section === 1;

  // Determine if this is a group slide section (2, 6, 9) - these get special treatment
  const isGroupSlide = section === 2 || section === 6 || section === 9;

  // Calculate entrance direction based on position
  // Cards slide in from the opposite side of where they'll end up
  const getEntranceX = () => {
    if (isFirstSection) return 0; // First section slides up from bottom
    if (textPosition === "left") return "-100%";  // Slide in from left
    if (textPosition === "right") return "100%";  // Slide in from right
    return 0;
  };

  // Only show for sections 1-12 (skills sections)
  // For section 1, wait for isFirstCardReady (after 3D animation completes)
  const isVisible = section > 0 && section < 13 && (targetSection === null || showCard) && (!isFirstSection || isFirstCardReady);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center ${positionClass}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${section}-${i18n.language}-${showCard}`}
          initial={{
            opacity: 0,
            x: getEntranceX(),
            y: isFirstSection ? "50vh" : 0,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
              duration: isFirstSection ? 0.7 : isGroupSlide ? 0.6 : 0.5,
              ease: [0.25, 0.1, 0.25, 1],
              delay: isGroupSlide ? 0.2 : 0 // Slight delay for group slides to let camera settle
            }
          }}
          exit={{
            opacity: 0,
            x: textPosition === "left" ? "-50%" : textPosition === "right" ? "50%" : 0,
            scale: 0.9,
            transition: { duration: 0.3, ease: "easeIn" }
          }}
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
      </AnimatePresence>
    </div>
  );
}
