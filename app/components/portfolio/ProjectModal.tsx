import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../../types";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useTranslation("common");
  const [activeImage, setActiveImage] = useState(0);
  const allImages = [project.image, ...project.mockups];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border border-white/10"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${project.color}, ${project.accentColor})` }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-video overflow-hidden rounded-t-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={allImages[activeImage]}
              alt={t(project.titleKey)}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 flex gap-2">
            {project.stats.map((stat) => (
              <div key={stat.label} className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
                <div className="text-xl font-bold" style={{ color: project.accentColor }}>{stat.value}</div>
                <div className="text-xs text-white/50 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${activeImage === i ? 'w-6' : ''}`}
                style={{ background: activeImage === i ? project.color : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: `${project.color}20`, color: project.accentColor }}>
                    {project.year}
                  </span>
                  <span className="text-white/50">{project.duration}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">{t(project.titleKey)}</h2>
                <p className="text-base text-white/60 leading-relaxed">{t(project.longDescriptionKey)}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: project.accentColor }}>
                  {t("portfolio.features")}
                </h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  {(t(`portfolio.projects.${project.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.features`, { returnObjects: true }) as string[]).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ background: `${project.color}30` }}>
                        <svg className="w-2.5 h-2.5" style={{ color: project.accentColor }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white/70 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: project.accentColor }}>
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/80 border border-white/5">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">Info Projet</h4>
                <div className="space-y-3">
                  {[
                    { label: "Client", value: project.client },
                    { label: "Role", value: project.role },
                    { label: "Duree", value: project.duration },
                    { label: "Annee", value: project.year },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-white/40">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}aa)` }}
              >
                <span>{t("portfolio.viewProject")}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              <button className="w-full py-3 rounded-lg font-medium text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>{t("portfolio.viewCode")}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
