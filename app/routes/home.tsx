import type { Route } from "./+types/home";
import Scene from "../components/Scene";
import "../styles/global.css";
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { Text } from "../components/Text";
import { ParticleText } from "../components/ParticleText";
import type { Experience } from "../components/Timeline3D";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eden Wisniewski - Full-Stack Developer" },
    { name: "description", content: "Portfolio - Solutions IT complètes" },
  ];
}

export default function Home() {
  const [section, setSection] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [detailScrollOffset, setDetailScrollOffset] = useState(0);
  const { t, i18n } = useTranslation('common');

  // Handle scroll for project detail view
  useEffect(() => {
    if (!selectedExperience) {
      setDetailScrollOffset(0);
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      if (selectedExperience) {
        e.preventDefault();
        const maxScroll = Math.max(0, selectedExperience.projects.length - 2);
        setDetailScrollOffset(prev => {
          const newOffset = prev + e.deltaY * 0.001;
          return Math.max(0, Math.min(maxScroll, newOffset));
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [selectedExperience]);

  const handleBackToTimeline = useCallback(() => {
    setSelectedExperience(null);
    setDetailScrollOffset(0);
  }, []);

  const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
  };

  const variants: Variants = {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // Section 0 is now the hero intro screen (centered)
  // Determine text position based on 3D element location
  // Position text on opposite side of 3D element for visibility
  const getTextPosition = () => {
    switch(section) {
      case 0: return 'center'; // Hero intro - centered
      case 1: return 'right';  // Frontend - left, text right
      case 2: return 'left';   // Backend - center, text left
      case 3: return 'left';   // Database - top, text left
      case 4: return 'left';   // Mobile - bottom, text left
      case 5: return 'left';   // Backoffice - right, text left
      case 6: return 'right';  // CI/CD - left, text right
      case 7: return 'right';  // Cloud - top left, text right
      case 8: return 'left';   // Testing - right, text left
      case 9: return 'center'; // Overview - centered
      default: return 'left';
    }
  };
  
  const textPosition = getTextPosition();
  const positionClass = textPosition === 'left' 
    ? 'justify-start pl-12 md:pl-20' 
    : textPosition === 'right' 
    ? 'justify-end pr-12 md:pr-20' 
    : 'justify-center';

  // Content for each section - aligned with 3D camera sequence
  const sectionContent: Record<number, { title: string; subtitle: string; category: string; items?: string[] }> = {
    0: {
      title: t('home.name'),
      subtitle: t('cards.hero.title'),
      category: 'Introduction',
      items: [
        'Développeur Full-Stack passionné',
        'Solutions web sur mesure',
        'De la conception au déploiement'
      ]
    },
    1: {
      title: 'Frontend',
      subtitle: 'Applications Web Modernes',
      category: 'Interface',
      items: [
        'React, Next.js, Remix pour des interfaces réactives',
        'TypeScript pour un code robuste et maintenable',
        'Animations fluides avec Framer Motion & Three.js',
        'Design responsive et accessible (WCAG)',
        'Performance optimisée (Core Web Vitals)'
      ]
    },
    2: {
      title: 'Backend',
      subtitle: 'Serveurs Node.js Performants',
      category: 'Serveur',
      items: [
        'API REST & GraphQL scalables',
        'Authentification sécurisée (JWT, OAuth2)',
        'Architecture microservices modulaire',
        'Gestion des sessions et middleware',
        'Validation des données et sécurité OWASP'
      ]
    },
    3: {
      title: 'Database',
      subtitle: 'Gestion des Données',
      category: 'Données',
      items: [
        'PostgreSQL pour les données relationnelles',
        'MongoDB pour les structures flexibles',
        'Redis pour le cache haute performance',
        'Migrations versionnées et rollback',
        'Optimisation des requêtes et indexation'
      ]
    },
    4: {
      title: 'Mobile',
      subtitle: 'Applications Cross-Platform',
      category: 'Mobile',
      items: [
        'React Native pour iOS et Android',
        'Performances natives optimisées',
        'Push notifications et deep linking',
        'Offline-first avec synchronisation',
        'Publication App Store & Play Store'
      ]
    },
    5: {
      title: 'Backoffice',
      subtitle: 'Tableaux de Bord Métier',
      category: 'Administration',
      items: [
        'Interfaces d\'administration sur mesure',
        'Dashboards analytiques en temps réel',
        'Gestion des utilisateurs et permissions',
        'Export de données et rapports',
        'Intégration CRM et outils métier'
      ]
    },
    6: {
      title: 'CI/CD',
      subtitle: 'Automatisation DevOps',
      category: 'Pipeline',
      items: [
        'GitHub Actions & GitLab CI configurés',
        'Tests automatisés à chaque commit',
        'Build et déploiement continu',
        'Environnements staging et production',
        'Rollback automatique en cas d\'erreur'
      ]
    },
    7: {
      title: 'Cloud',
      subtitle: 'Infrastructure Scalable',
      category: 'Hébergement',
      items: [
        'Déploiement AWS, GCP, Vercel',
        'CDN global pour performances optimales',
        'Auto-scaling selon la charge',
        'Stockage sécurisé S3/Cloud Storage',
        'Monitoring et alertes 24/7'
      ]
    },
    8: {
      title: 'Testing',
      subtitle: 'Qualité Garantie',
      category: 'Qualité',
      items: [
        'Tests unitaires avec Jest/Vitest',
        'Tests d\'intégration API',
        'Tests E2E avec Playwright/Cypress',
        'Coverage maintenu au-dessus de 80%',
        'Revue de code et standards qualité'
      ]
    },
    9: {
      title: 'Full-Stack',
      subtitle: 'Solutions Complètes',
      category: 'Vue d\'ensemble',
      items: [
        'Architecture de bout en bout',
        'Stack technique moderne et évolutive',
        'Accompagnement projet de A à Z',
        'Maintenance et évolutions continues'
      ]
    },
    10: {
      title: 'Expérience',
      subtitle: 'Mon Parcours Professionnel',
      category: 'Timeline',
      items: [
        'Cliquez sur un bloc pour voir les projets réalisés'
      ]
    }
  };

  const content = sectionContent[section] || sectionContent[0];

  return (
    <main className="w-full h-screen bg-gradient-to-b from-[#0a192f] via-[#0d2847] to-[#164e63] relative overflow-hidden">
      <Scene
        onSectionChange={setSection}
        onExperienceSelect={setSelectedExperience}
        selectedExperienceId={selectedExperience?.id || null}
        detailScrollOffset={detailScrollOffset}
      />

      {/* Back button - shown when in detail view */}
      <AnimatePresence>
        {selectedExperience && section === 10 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackToTimeline}
            className="fixed top-20 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Retour</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Language Switcher */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
          <button onClick={() => changeLanguage('fr')} className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${i18n.language === 'fr' ? 'bg-cyan-500 text-black border-cyan-500' : 'text-white/70 border-white/20 hover:border-white/40'}`}>FR</button>
          <button onClick={() => changeLanguage('en')} className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${i18n.language === 'en' ? 'bg-cyan-500 text-black border-cyan-500' : 'text-white/70 border-white/20 hover:border-white/40'}`}>EN</button>
      </div>

      {/* Section Progress Indicator */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-50">
          {[0,1,2,3,4,5,6,7,8,9,10].map((i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  section === i
                    ? 'h-6 bg-cyan-400'
                    : section > i
                    ? 'h-2 bg-cyan-400/50'
                    : 'h-2 bg-white/20'
                }`}
              />
          ))}
      </div>

      {/* Phase Label */}
      <div className="fixed top-4 left-4 z-50">
        <span className="text-xs text-white/40 font-mono">PHASE {section + 1}/11</span>
      </div>

      {/* Hero Intro Screen - Section 0 */}
      <AnimatePresence>
        {section === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 w-full h-full z-20 pointer-events-none flex flex-col items-center justify-center"
          >
            <div style={{ filter: 'drop-shadow(0 0 60px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 120px rgba(6, 182, 212, 0.3))' }}>
              <ParticleText text="Eden Wisniewski" fontSize={80} mouseRadius={120} />
            </div>

            <div className="mt-4" style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}>
              <Text text="Let's make it real" size="s" />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="mt-12 flex flex-col items-center"
            >
              <span className="text-white/50 text-sm mb-2">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
              >
                <motion.div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Overlay - Position alternates (hidden on section 0) */}
      {section > 0 && (
        <div className={`absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center ${positionClass}`}>
            <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="max-w-md"
                >
                  <div className="backdrop-blur-md bg-black/40 p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <span className="text-xs font-mono text-cyan-400/70 uppercase tracking-wider">
                      {content.category}
                    </span>

                    <h1 className="text-4xl md:text-5xl font-black text-white mt-2 tracking-tight">
                      {content.title}
                    </h1>

                    <h2 className="text-xl text-cyan-400 mt-1 font-medium">
                      {content.subtitle}
                    </h2>

                    {content.items && (
                      <ul className="mt-6 space-y-2">
                        {content.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section === 9 && (
                      <button className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all pointer-events-auto">
                        {t('home.cta')}
                      </button>
                    )}
                  </div>
                </motion.div>
            </AnimatePresence>
        </div>
      )}

      {/* Scroll indicator when in detail view */}
      <AnimatePresence>
        {selectedExperience && section === 10 && selectedExperience.projects.length > 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-white/40"
          >
            <span className="text-xs mb-2">Scrollez pour voir les projets</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
