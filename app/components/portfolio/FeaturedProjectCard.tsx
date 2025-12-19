import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import type { Project } from "../../types";

interface FeaturedProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function FeaturedProjectCard({ project, onClick }: FeaturedProjectCardProps) {
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
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
        <div
          className="absolute -inset-1 rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
          style={{ background: `linear-gradient(135deg, ${project.color}30, transparent)` }}
        />

        <div className="relative grid lg:grid-cols-2 gap-0">
          <div className="relative aspect-4/3 lg:aspect-auto overflow-hidden">
            <div className="absolute inset-4 lg:inset-6 rounded-xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10">
              <div className="h-8 bg-gray-800/90 flex items-center px-3 gap-1.5 border-b border-white/5">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-700/50 rounded-md h-5 max-w-45 flex items-center px-2 gap-1.5">
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
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
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
