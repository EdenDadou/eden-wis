import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface AboutSectionProps {
  section: number;
  showCard: boolean;
  targetSection: number | null;
}

export function AboutSection({ section, showCard, targetSection }: AboutSectionProps) {
  const { t } = useTranslation("common");

  const isVisible = section === 15 && (targetSection === null || showCard);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          {/* About Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-xl w-full mx-4 pointer-events-auto"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/70 backdrop-blur-xl border border-white/10 shadow-2xl">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />

              {/* Content */}
              <div className="relative p-8 md:p-10">
                {/* Header with photo */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                  {/* Photo placeholder */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="relative shrink-0"
                  >
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 p-[2px] overflow-hidden">
                      {/* Replace src with your photo path */}
                      <img
                        src="/images/profile.jpg"
                        alt="Eden Wisniewski"
                        className="w-full h-full rounded-2xl object-cover bg-gray-800"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center absolute inset-0">
                        <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                          EW
                        </span>
                      </div>
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-gray-900 animate-pulse" />
                  </motion.div>

                  {/* Name & Title */}
                  <div className="text-center md:text-left">
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl md:text-4xl font-black text-white tracking-tight"
                    >
                      {t("about.name")}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-cyan-400 font-medium mt-1"
                    >
                      {t("about.role")}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-center md:justify-start gap-2 mt-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-white/50">{t("about.available")}</span>
                    </motion.div>
                  </div>
                </div>

                {/* Bio */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/70 leading-relaxed text-base md:text-lg mb-6"
                >
                  {t("about.bio")}
                </motion.p>

                {/* Experience highlight */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 mb-6"
                >
                  <p className="text-white/60 text-sm leading-relaxed">
                    {t("about.experience")}
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                  >
                    {t("about.cta.contact")}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
