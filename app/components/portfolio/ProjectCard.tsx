import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
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
      <div className="relative h-full overflow-hidden rounded-2xl bg-linear-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
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
                <div className="bg-gray-800 rounded-4xl p-1.5 shadow-2xl border-[3px] border-gray-700">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />
                  <div className="rounded-3xl overflow-hidden aspect-9/19 bg-gray-900">
                    <img
                      src={project.image}
                      alt={t(project.titleKey)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
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
