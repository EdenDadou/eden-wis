import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FeaturedProjectCard, ProjectCard, ProjectModal } from "../portfolio";
import type { Project } from "../../types";
import type { RefObject } from "react";

interface PortfolioSectionProps {
  section: number;
  showCard: boolean;
  targetSection: number | null;
  isNavigating: boolean;
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function PortfolioSection({
  section,
  showCard,
  targetSection,
  isNavigating,
  projects,
  selectedProject,
  onSelectProject,
  scrollRef,
}: PortfolioSectionProps) {
  const { t } = useTranslation("common");

  // Portfolio is now section 11
  const isVisible = section === 11 && (targetSection === null || showCard) && !isNavigating;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1
              }
            }}
            exit={{
              opacity: 0,
              y: -20,
              filter: "blur(8px)",
              transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
            }}
            className="absolute inset-0 z-10 overflow-y-auto pointer-events-auto"
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-sm" />

            <div className="relative min-h-screen px-4 sm:px-6 py-24">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
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
                    onClick={() => onSelectProject(projects[0])}
                  />

                  {/* Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.slice(1).map((project, i) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        onClick={() => onSelectProject(project)}
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
                  <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-gray-900/80 to-gray-900/40 border border-white/10 p-8 md:p-12 text-center">
                    <div className="absolute inset-0 bg-linear-to-r from-violet-600/10 via-transparent to-cyan-600/10" />
                    <div className="relative">
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">{t("portfolio.cta.title")}</h3>
                      <p className="text-white/50 mb-6 max-w-lg mx-auto">{t("portfolio.cta.description")}</p>
                      <button className="px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 font-bold rounded-xl text-white hover:scale-105 active:scale-95 transition-transform">
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
            onClose={() => onSelectProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
