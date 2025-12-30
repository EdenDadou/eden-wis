import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import { SECTION_ANGLES, ORBIT_RADIUS } from "./scene3d";

// Composant Text 3D avec effet morphing lors du changement de langue
// Inspiré de Magic UI MorphingText - effet de fondu croisé smooth
interface MorphingText3DProps {
  children: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
  anchorX?: "left" | "center" | "right";
  anchorY?: "top" | "middle" | "bottom";
  fontWeight?: "normal" | "bold";
}

interface MorphState {
  oldText: string;
  newText: string;
  progress: number; // 0 = old text visible, 1 = new text visible
}

function MorphingText3D({
  children,
  position = [0, 0, 0],
  fontSize = 0.22,
  color = "white",
  anchorX = "center",
  anchorY = "middle",
  fontWeight = "bold",
}: MorphingText3DProps) {
  const { i18n } = useTranslation();
  const [morphState, setMorphState] = useState<MorphState>({
    oldText: children,
    newText: children,
    progress: 1,
  });
  const prevLangRef = useRef(i18n.language);
  const prevChildrenRef = useRef(children);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Update without animation if only children changed (not language)
    if (
      prevChildrenRef.current !== children &&
      prevLangRef.current === i18n.language
    ) {
      prevChildrenRef.current = children;
      setMorphState({ oldText: children, newText: children, progress: 1 });
      return;
    }

    // Skip if language didn't change
    if (prevLangRef.current === i18n.language) {
      return;
    }

    const oldText = prevChildrenRef.current;
    prevLangRef.current = i18n.language;
    prevChildrenRef.current = children;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const morphDuration = 800; // ms for full morph
    const startTime = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / morphDuration, 1);

      // Smooth easing
      const eased = 1 - Math.pow(1 - progress, 3);

      setMorphState({
        oldText,
        newText: children,
        progress: eased,
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setMorphState({ oldText: children, newText: children, progress: 1 });
      }
    };

    setMorphState({ oldText, newText: children, progress: 0 });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [children, i18n.language]);

  const { oldText, newText, progress } = morphState;

  // Calculate opacities with smooth crossfade
  const oldOpacity = Math.pow(1 - progress, 0.4);
  const newOpacity = Math.pow(progress, 0.4);

  // If not morphing, just show single text
  if (progress === 1) {
    return (
      <Text
        position={position}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        fontWeight={fontWeight}
      >
        {newText}
      </Text>
    );
  }

  return (
    <group position={position}>
      {/* Old text fading out */}
      <Text
        position={[0, 0, -0.01]}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        fontWeight={fontWeight}
        fillOpacity={oldOpacity}
      >
        {oldText}
      </Text>
      {/* New text fading in */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        fontWeight={fontWeight}
        fillOpacity={newOpacity}
      >
        {newText}
      </Text>
    </group>
  );
}

// Types pour les détails étendus d'un projet
export interface ProjectFeature {
  title: string;
  description: string;
  icon?: string; // emoji ou nom d'icône
}

export interface ProjectArchitecture {
  title: string;
  items: string[];
}

export interface ProjectDetails {
  overview: string;
  architecture: ProjectArchitecture[];
  features: ProjectFeature[];
  challenges?: string[];
  metrics?: { label: string; value: string }[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  details?: ProjectDetails; // Détails étendus optionnels
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  startYear: number;
  endYear: number | null; // null = Aujourd'hui
  color: string;
  row: "top" | "bottom";
  projects: Project[];
  isEducation?: boolean; // Pour différencier études et expériences pro
}

// Données d'expérience et formation
export const experienceData: Experience[] = [
  {
    id: "etude",
    company: "Étude",
    role: "Licence Concepteur Développeur Web & Mobile",
    period: "Sept 2018 - Nov 2019",
    startYear: 2019,
    endYear: 2019.85, // ~Novembre
    color: "#2563eb", // Bleu
    row: "top",
    isEducation: true,
    projects: [
      {
        name: "Projet de fin d'études",
        description:
          "Application web complète avec authentification et gestion de données",
        tech: ["PHP", "MySQL", "JavaScript"],
      },
      {
        name: "Stage développeur",
        description: "Stage de 3 mois en entreprise",
        tech: ["HTML", "CSS", "JavaScript"],
      },
    ],
  },
  {
    id: "e4ia",
    company: "E4iA",
    role: "Développeur",
    period: "Jan 2020 - Juil 2020",
    startYear: 2020,
    endYear: 2020.5, // ~Juillet
    color: "#7c3aed", // Violet
    row: "top",
    projects: [
      {
        name: "Projet 1",
        description: "Description du projet chez E4iA",
        tech: ["React", "Node.js"],
      },
    ],
  },
  {
    id: "atecna",
    company: "Atecna",
    role: "Développeur Full-Stack",
    period: "Oct 2020 - Aujourd'hui",
    startYear: 2020.8, // ~Octobre
    endYear: null,
    color: "#ea580c", // Orange
    row: "top",
    projects: [
      {
        name: "Au Vieux Campeur - App Mobile v2",
        description:
          "Application mobile e-commerce cross-platform pour la chaîne de magasins d'équipement outdoor Au Vieux Campeur. Refonte design partielle de l'app existante.",
        tech: [
          "React Native",
          "Expo",
          "Expo Router",
          "TypeScript",
          "NativeWind",
          "Reanimated",
          "Firebase",
          "Magento API",
          "Salesforce",
        ],
        details: {
          overview:
            "VieuxCampeur est une application mobile e-commerce cross-platform (iOS/Android) développée pour la chaîne de magasins d'équipement outdoor 'Au Vieux Campeur'. Version 2.1.7 avec refonte design partielle, l'application offre une expérience shopping complète avec scanner de produits, localisateur de magasins et programme fidélité.",
          architecture: [
            {
              title: "Framework & Navigation",
              items: [
                "React Native 0.76.9 avec Expo ~52.0 (framework managé)",
                "Expo Router ~4.0 pour routing basé sur fichiers",
                "React Navigation avec tabs et navigation imbriquée",
                "TypeScript 5.3 pour le typage statique",
              ],
            },
            {
              title: "UI & Animations",
              items: [
                "NativeWind (Tailwind CSS pour React Native)",
                "Moti pour animations simples",
                "React Native Reanimated pour animations avancées",
                "Expo Vector Icons + React Native SVG",
              ],
            },
            {
              title: "État & Persistance",
              items: [
                "React Context API (UserContext, ProductContext)",
                "AsyncStorage pour persistance locale",
                "Système de double token (Admin + Client)",
                "Cache de tokens pour optimisation API",
              ],
            },
            {
              title: "Backend & Services",
              items: [
                "Magento REST API pour e-commerce",
                "Salesforce Search pour recherche produits",
                "CouchDB pour données des magasins",
                "Firebase (notifications push, analytics)",
              ],
            },
          ],
          features: [
            {
              title: "Authentification Multi-étapes",
              description:
                "Connexion/inscription, réinitialisation mot de passe, session persistante, support utilisateur anonyme, profil complet",
              icon: "🔐",
            },
            {
              title: "Recherche & Découverte",
              description:
                "Recherche full-text Salesforce, navigation marques/catégories, filtres avancés (prix, attributs, facettes), tri et pagination",
              icon: "🔍",
            },
            {
              title: "Shopping & Panier",
              description:
                "Gestion panier avec sync backend, wishlist, détails produits avec variantes, vérification stocks en temps réel",
              icon: "🛒",
            },
            {
              title: "Gestion Commandes",
              description:
                "Historique paginé, suivi livraison temps réel, gestion retours, téléchargement factures PDF, fonction recommander",
              icon: "📦",
            },
            {
              title: "Scanner & Magasins",
              description:
                "Scanner QR/codes-barres avec caméra et lampe torche, localisateur magasins avec Google Maps et géolocalisation",
              icon: "📍",
            },
            {
              title: "Fidélité & Notifications",
              description:
                "Carte Club fidélité, coupons, alertes produits, notifications push Firebase avec gestion automatique des tokens",
              icon: "🎁",
            },
          ],
          challenges: [
            "Intégration de multiples APIs (Magento, Salesforce, CouchDB, Firebase) avec gestion cohérente des erreurs",
            "Système d'authentification double token avec cache optimisé pour réduire les appels API",
            "Refonte design partielle tout en maintenant la compatibilité avec les fonctionnalités existantes",
            "Optimisation performance avec Hermes et nouvelle architecture React Native",
          ],
          metrics: [
            { label: "Plateformes", value: "iOS/Android" },
            { label: "Version", value: "2.1.7" },
            { label: "APIs intégrées", value: "4+" },
            { label: "Onglets", value: "5" },
          ],
        },
      },
      {
        name: "OPPBTP : Bonnes Pratiques Cordiste",
        description:
          "Plateforme web de partage et gestion des bonnes pratiques pour le métier de cordiste dans le secteur BTP. Architecture content-driven avec Contentful.",
        tech: [
          "Remix.js",
          "React 18",
          "TypeScript",
          "Vite",
          "Express",
          "Contentful",
          "Tailwind CSS",
          "Framer Motion",
          "Zod",
          "OpenID Connect",
          "SendGrid",
        ],
        details: {
          overview:
            "Plateforme web moderne de partage et gestion des bonnes pratiques pour le métier de cordiste dans le secteur BTP. Développée pour l'OPPBTP, cette application permet aux professionnels de créer, partager et consulter des fiches de bonnes pratiques avec un système multi-métiers extensible.",
          architecture: [
            {
              title: "Framework & Rendu",
              items: [
                "Remix.js 2.13 - Meta-framework full-stack avec SSR",
                "React 18 pour l'interface utilisateur",
                "TypeScript 5.6 pour le typage statique",
                "Vite 5.4 comme build tool et dev server",
                "Express.js pour le serveur HTTP backend",
              ],
            },
            {
              title: "CMS & Contenu",
              items: [
                "Contentful comme CMS headless et base de données",
                "Rich text renderer pour le contenu enrichi",
                "Live Preview pour prévisualisation en direct",
                "8 modèles de contenu (Métier, Fiche, Homepage...)",
              ],
            },
            {
              title: "Formulaires & Validation",
              items: [
                "React Hook Form pour la gestion d'état",
                "Zod pour validation TypeScript runtime",
                "React Dropzone pour upload multi-fichiers",
                "React Cropper pour recadrage d'images",
              ],
            },
            {
              title: "Auth & Services",
              items: [
                "OpenID Connect pour authentification OAuth2",
                "JWT avec sessions cookie sécurisées",
                "SendGrid + Twig pour emails transactionnels",
                "reCAPTCHA v3 pour protection anti-bot",
              ],
            },
          ],
          features: [
            {
              title: "Création de Fiches en 4 Étapes",
              description:
                "Workflow guidé : description avec images, évaluation d'impact, métadonnées (titre, type solution, facteurs, PDF), puis infos auteur et validation CGU",
              icon: "📝",
            },
            {
              title: "Découverte & Recherche",
              description:
                "Recherche avec debounce, filtres multi-sélection (localisation, facteurs, types solutions, métiers), pagination et tri par date",
              icon: "🔍",
            },
            {
              title: "Système Multi-Métiers",
              description:
                "Routes spécifiques par métier (/:base/fiches), métadonnées depuis Contentful, context provider dédié pour extensibilité",
              icon: "👷",
            },
            {
              title: "Auth Enterprise-Grade",
              description:
                "OpenID Connect, gestion JWT, sessions cookies, système de rôles (FULL_ACCESS, READER, REFUSED), profil utilisateur complet",
              icon: "🔐",
            },
            {
              title: "Design Responsive Avancé",
              description:
                "Context viewport côté client, client hints côté serveur, 7 breakpoints personnalisés (xs à 2xl), optimisations mobile",
              icon: "📱",
            },
            {
              title: "Analytics & Conformité",
              description:
                "GTM intégré, tracking événements data layer, gestion consentement Didomi, notifications email SendGrid",
              icon: "📊",
            },
          ],
          challenges: [
            "Architecture content-driven sans base de données séparée (Contentful comme source unique)",
            "Workflow de création multi-étapes avec upload fichiers, recadrage images et validation complexe",
            "Système multi-métiers extensible avec routes dynamiques et contextes dédiés",
            "Détection responsive hybride (client context + server client hints)",
          ],
          metrics: [
            { label: "Routes", value: "18" },
            { label: "Composants UI", value: "40+" },
            { label: "Context Providers", value: "6" },
            { label: "Modèles CMS", value: "8" },
          ],
        },
      },
      {
        name: "OPPBTP : PreventionBTP v3",
        description:
          "Refonte totale (v3) du site officiel preventionbtp.fr - Application web entreprise pour la prévention et sécurité du secteur BTP français.",
        tech: [
          "React Router 7",
          "React 18",
          "TypeScript",
          "Vite",
          "Express",
          "Contentful",
          "Algolia",
          "Tailwind CSS",
          "Framer Motion",
          "Zod",
          "OpenID Connect",
          "Docker",
        ],
        details: {
          overview:
            "PreventionBTP est la plateforme digitale officielle de l'OPPBTP (Organisme Professionnel de Prévention du BTP). Cette refonte v3 représente une modernisation complète de l'architecture et de l'expérience utilisateur, servant des milliers de professionnels du secteur BTP en France.",
          architecture: [
            {
              title: "Frontend",
              items: [
                "React Router 7 (anciennement Remix) - Framework full-stack avec SSR",
                "React 18 avec Suspense et Concurrent Features",
                "TypeScript strict pour la type-safety",
                "Tailwind CSS + Framer Motion pour les animations",
                "Swiper pour les carrousels, Highcharts pour la data viz",
              ],
            },
            {
              title: "Backend & API",
              items: [
                "Express.js comme serveur Node.js",
                "API REST complète (/api/content, /api/form, /api/algolia...)",
                "Middlewares custom (auth, sessions, logging)",
                "Intégration API legacy Paddix pour le contenu métier",
              ],
            },
            {
              title: "CMS & Contenu",
              items: [
                "Contentful comme CMS headless",
                "71 composants dynamiques mappés pour le rendu",
                "Mode Live Preview pour l'édition en temps réel",
                "Support rich text et markdown",
              ],
            },
            {
              title: "Infrastructure",
              items: [
                "Docker + Nginx comme reverse proxy",
                "Pipeline GitLab CI/CD",
                "3 environnements : dev → preprod → prod",
                "Logging structuré avec Winston (rotation quotidienne)",
              ],
            },
          ],
          features: [
            {
              title: "Recherche Avancée",
              description:
                "Algolia avec recherche full-text, facettes dynamiques, suggestions temps réel et recherche IA via Perplexity",
              icon: "🔍",
            },
            {
              title: "Authentification SSO",
              description:
                "Flux OpenID Connect complet avec contrôle d'accès par rôles (FULL_ACCESS, READER, REFUSED) et permissions par entreprise",
              icon: "🔐",
            },
            {
              title: "Formulaires Interactifs",
              description:
                "Inscription, demandes formation, commandes ressources, quiz prévention - validation Zod + react-hook-form + reCAPTCHA",
              icon: "📝",
            },
            {
              title: "Sections Métier",
              description:
                "Formations (initiale/continue), Ressources (mémos, guides), Actualités, Droit de la Prévention, Observatoire statistiques, E-learning, Webinaires",
              icon: "📚",
            },
            {
              title: "SEO & Performance",
              description:
                "SSR complet, génération sitemaps XML, Bing IndexNow pour indexation instantanée, optimisation images, détection bots",
              icon: "⚡",
            },
            {
              title: "Analytics & Monitoring",
              description:
                "GTM, Matomo, Hotjar (heatmaps), Zendesk (support), Didomi (consentement cookies), health checks services",
              icon: "📊",
            },
          ],
          challenges: [
            "Migration depuis une architecture legacy tout en maintenant la compatibilité avec l'API Paddix existante",
            "Gestion de 100+ routes avec SSR et optimisation des performances",
            "Synchronisation de contenu entre 3 environnements avec scripts de déploiement custom",
            "Implémentation d'un système de composants dynamiques Contentful (71 composants)",
          ],
          metrics: [
            { label: "Routes", value: "100+" },
            { label: "Composants CMS", value: "71" },
            { label: "Types TypeScript", value: "50+" },
            { label: "Intégrations tierces", value: "10+" },
          ],
        },
      },
      {
        name: "Wipple - Réservation Salles",
        description:
          "Plateforme de réservation de salles de réunion avec synchronisation calendriers, boîtiers connectés et visualisation temps réel des disponibilités.",
        tech: [
          "Remix",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Office 365",
          "Google Agenda",
        ],
      },
      {
        name: "GoCrisis - Gestion de Crise",
        description:
          "Application mobile de gestion de crise permettant aux entreprises d'évaluer, gérer et coordonner leurs réponses aux situations de crise.",
        tech: [
          "React Native",
          "TypeScript",
          "Redux Toolkit",
          "Redux-Saga",
          "NativeBase",
          "Parse Server",
          "React Hook Form",
          "i18n",
          "Hermes",
        ],
        details: {
          overview:
            "GoCrisis est une application mobile professionnelle de gestion de crise d'entreprise (v3.1.7). Elle permet aux équipes d'évaluer les situations de crise via un système de questionnaires intelligents, de coordonner les réponses avec gestion d'équipe par rôles, et de déclencher les protocoles appropriés selon le niveau de gravité.",
          architecture: [
            {
              title: "Framework & Runtime",
              items: [
                "React Native 0.75.2 cross-platform (iOS/Android)",
                "TypeScript 4.8 pour typage statique",
                "Hermes activé - moteur JS optimisé",
                "Fabric - nouveau moteur de rendu React Native",
              ],
            },
            {
              title: "State Management",
              items: [
                "Redux Toolkit pour gestion centralisée",
                "Redux-Saga pour effets de bord asynchrones",
                "3 slices : appSlice, assessmentSlice, userSlice",
                "AsyncStorage pour persistance locale",
              ],
            },
            {
              title: "UI & Navigation",
              items: [
                "NativeBase 3.4 comme framework UI",
                "@react-navigation/stack pour navigation par pile",
                "11 écrans avec Login (614 lignes) le plus complexe",
                "Support multilingue i18n-js + react-native-localize",
              ],
            },
            {
              title: "Backend & API",
              items: [
                "Parse Server comme Backend as a Service",
                "21 modules d'API pour les différentes entités",
                "Notifications email/SMS via Parse Cloud",
                "Système d'authentification avec domaine/utilisateur",
              ],
            },
          ],
          features: [
            {
              title: "Évaluation de Crise",
              description:
                "3 types de situation (REAL, SIMULATION, TEST), création et complétion d'évaluations, statuts ACTIVE/IN_PREPARATION/NOT_REACHED/NOT_ACTIVATED",
              icon: "🚨",
            },
            {
              title: "Questionnaire Intelligent",
              description:
                "Questions en JSON avec logique de branchement, thématiques (Vie humaine, Juridique...), mécanisme de scoring, navigation conditionnelle",
              icon: "📋",
            },
            {
              title: "Gestion des Scénarios",
              description:
                "Sélection type de crise (ECL), création avec paramètres, modes Formation/Simulation/Réel, personnalisation par entreprise",
              icon: "⚙️",
            },
            {
              title: "Coordination d'Équipe",
              description:
                "Rôles LEADER/MANAGER, assignation par fonction, notifications basées sur les rôles, templates par type de membre",
              icon: "👥",
            },
            {
              title: "Authentification Sécurisée",
              description:
                "Login domaine/utilisateur/mot de passe, auto-login, réinitialisation mot de passe, vérification liste noire",
              icon: "🔐",
            },
            {
              title: "Notifications Multi-Canal",
              description:
                "Notifications email et SMS via Parse Cloud, templates par rôle, confirmation de réception, suivi des notifiés",
              icon: "📬",
            },
          ],
          challenges: [
            "Système de questionnaires dynamiques avec logique de branchement et scoring complexe",
            "Gestion de 3 modes de crise (Formation/Simulation/Réel) avec workflows distincts",
            "Coordination temps réel d'équipes avec rôles hiérarchiques (LEADER/MANAGER)",
            "Migration vers Hermes et Fabric pour optimisation performance iOS/Android",
          ],
          metrics: [
            { label: "Version", value: "3.1.7" },
            { label: "Fichiers TS/TSX", value: "104" },
            { label: "Modules API", value: "21" },
            { label: "Écrans", value: "11" },
          ],
        },
      },
      {
        name: "Elistair - Portail Client Drones",
        description:
          "Portail client B2B pour Elistair, leader européen des drones captifs pour applications défense, sécurité et industrie. Gestion de flotte et monitoring temps réel.",
        tech: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Prisma",
          "PostgreSQL",
          "tRPC",
          "NextAuth",
          "Docker",
          "AWS",
        ],
        details: {
          overview:
            "Portail client B2B développé pour Elistair, entreprise française leader européen des drones captifs (tethered drones). La plateforme sert des clients gouvernementaux, militaires et industriels pour la gestion de leur flotte de drones, le monitoring temps réel des missions et l'accès à la documentation technique sécurisée.",
          architecture: [
            {
              title: "Frontend & Framework",
              items: [
                "Next.js 14 avec App Router et Server Components",
                "React 18 avec Suspense pour le streaming",
                "TypeScript strict avec validation Zod end-to-end",
                "Tailwind CSS pour le design system custom",
                "Recharts pour la data visualization temps réel",
              ],
            },
            {
              title: "Backend & API",
              items: [
                "tRPC pour API typée end-to-end",
                "Prisma ORM avec PostgreSQL",
                "NextAuth.js pour authentification multi-provider",
                "API Routes pour webhooks et intégrations",
              ],
            },
            {
              title: "Sécurité & Auth",
              items: [
                "Authentification SSO entreprise (SAML/OAuth)",
                "Contrôle d'accès basé sur les rôles (RBAC)",
                "Audit logs pour conformité défense",
                "Chiffrement données sensibles",
              ],
            },
            {
              title: "Infrastructure",
              items: [
                "Docker containers pour déploiement",
                "AWS (ECS, RDS, S3, CloudFront)",
                "CI/CD GitHub Actions",
                "Monitoring et alerting CloudWatch",
              ],
            },
          ],
          features: [
            {
              title: "Gestion de Flotte",
              description:
                "Dashboard centralisé pour visualiser et gérer l'ensemble des drones captifs, statuts opérationnels, maintenance préventive et historique",
              icon: "🚁",
            },
            {
              title: "Monitoring Temps Réel",
              description:
                "Suivi en direct des missions avec télémétrie, alertes automatiques, cartographie et replay des vols",
              icon: "📡",
            },
            {
              title: "Documentation Sécurisée",
              description:
                "Accès contrôlé aux manuels techniques, procédures de maintenance, certificats et documents réglementaires",
              icon: "📋",
            },
            {
              title: "Gestion des Utilisateurs",
              description:
                "Administration multi-tenant avec rôles personnalisés, SSO entreprise et audit trail complet",
              icon: "👥",
            },
            {
              title: "Rapports & Analytics",
              description:
                "Génération de rapports de mission, statistiques d'utilisation, KPIs de performance flotte",
              icon: "📊",
            },
            {
              title: "Support & Tickets",
              description:
                "Système de ticketing intégré, base de connaissances, chat support et suivi des demandes SAV",
              icon: "🎫",
            },
          ],
          challenges: [
            "Conformité aux exigences de sécurité pour clients défense et gouvernementaux",
            "Architecture multi-tenant avec isolation stricte des données clients",
            "Intégration temps réel avec les systèmes de télémétrie des drones",
            "Performance et disponibilité critique pour applications de surveillance",
          ],
          metrics: [
            { label: "Clients", value: "Gov/Mil" },
            { label: "Uptime SLA", value: "99.9%" },
            { label: "Rôles RBAC", value: "8+" },
            { label: "Endpoints API", value: "50+" },
          ],
        },
      },
      {
        name: "Cora Wine - E-commerce Vins",
        description:
          "Site e-commerce de vente de vins avec catalogue de dizaines de milliers de références, gestion de contenu via CMS headless Prismic.",
        tech: [
          "Remix",
          "React",
          "TypeScript",
          "Prismic",
          "Tailwind CSS",
          "Node.js",
        ],
      },
      {
        name: "Beager - Plateforme Freelance v2",
        description:
          "Refonte complète (v2) de la plateforme de mise en relation entre freelances et entreprises avec génération automatique de documents contractuels.",
        tech: [
          "Next.js",
          "React",
          "TypeScript",
          "Tailwind CSS",
          "Prisma",
          "PostgreSQL",
          "tRPC",
          "NextAuth",
          "PDF Generation",
          "Stripe",
        ],
        details: {
          overview:
            "Beager est une plateforme innovante de mise en relation entre freelances et entreprises, fondée en 2020. La v2 apporte une refonte complète avec génération automatique de documents contractuels basée sur les données collectées lors du matching. Parmi les clients : Accor, RATP, SNCF, Clarins, BlaBlaCar. La plateforme privilégie la qualité sur le volume avec un matching en 72h et paiements garantis.",
          architecture: [
            {
              title: "Frontend & Framework",
              items: [
                "Next.js 14 avec App Router et Server Components",
                "React 18 avec Suspense pour le streaming",
                "TypeScript strict avec validation Zod",
                "Tailwind CSS pour le design system responsive",
                "Framer Motion pour les animations fluides",
              ],
            },
            {
              title: "Backend & API",
              items: [
                "tRPC pour API typée end-to-end",
                "Prisma ORM avec PostgreSQL",
                "NextAuth.js pour authentification multi-provider",
                "Webhooks pour intégrations externes",
              ],
            },
            {
              title: "Génération Documents",
              items: [
                "Génération PDF automatique des contrats",
                "Templates dynamiques basés sur les données de matching",
                "Signature électronique intégrée",
                "Archivage sécurisé des documents",
              ],
            },
            {
              title: "Infrastructure",
              items: [
                "Vercel pour le déploiement et CDN",
                "PostgreSQL managé (Neon/Supabase)",
                "Stripe pour les paiements sécurisés",
                "CI/CD GitHub Actions",
              ],
            },
          ],
          features: [
            {
              title: "Matching Intelligent",
              description:
                "Algorithme de mise en relation basé sur les compétences, disponibilités et préférences. Matching en 72h avec présélection qualitative",
              icon: "🎯",
            },
            {
              title: "Génération Contractuelle",
              description:
                "Documents contractuels générés automatiquement à partir des données du matching : contrats, avenants, NDA, factures",
              icon: "📄",
            },
            {
              title: "Profils Vérifiés",
              description:
                "Processus de vérification des freelances : compétences validées, références vérifiées, expériences confirmées",
              icon: "✅",
            },
            {
              title: "Paiements Garantis",
              description:
                "Système de paiement sécurisé avec Stripe, facturation automatique et garantie de paiement pour les freelances",
              icon: "💳",
            },
            {
              title: "Dashboard Entreprise",
              description:
                "Interface dédiée aux entreprises : gestion des missions, suivi des freelances, analytics et reporting",
              icon: "📊",
            },
            {
              title: "Espace Freelance",
              description:
                "Profil enrichi, gestion des disponibilités, historique des missions, suivi des revenus et documents",
              icon: "👤",
            },
          ],
          challenges: [
            "Génération dynamique de documents PDF contractuels complexes avec données variables",
            "Algorithme de matching multicritères performant avec scoring en temps réel",
            "Intégration Stripe complète avec gestion des paiements récurrents et des commissions",
            "Architecture multi-tenant avec isolation des données entreprises clientes",
          ],
          metrics: [
            { label: "Clients", value: "50+" },
            { label: "Matching", value: "72h" },
            { label: "Freelances", value: "1000+" },
            { label: "Types docs", value: "6+" },
          ],
        },
      },
      {
        name: "Catalina - Fidélité Gamifiée Retail",
        description:
          "Plateforme de fidélité gamifiée pour le retail permettant aux enseignes de proposer des jeux (casino, grattage, roue) et récompenses à leurs clients.",
        tech: [
          "Next.js 15",
          "React",
          "TypeScript",
          "Zod",
          "Styled-components",
          "Azure",
          "CryptoJS",
          "Vitest",
          "MSW",
          "i18next",
        ],
        details: {
          overview:
            "Catalina est une plateforme de fidélité gamifiée pour le retail, structurée en monorepo avec un BFF Next.js 15 et un frontend React. Elle permet aux enseignes (Carrefour, Tigros, Aldi...) de proposer des jeux de fidélité (casino, grattage, roue) avec système de rewards, en mode e-commerce ou in-store (tickets de caisse).",
          architecture: [
            {
              title: "Monorepo & BFF",
              items: [
                "catalina-next : Backend-for-Frontend Next.js 15 (Port 4000)",
                "shop-play : Frontend React 16 legacy",
                "Proxy vers API Catalina SI externe",
                "Flux : Frontend → BFF → Catalina SI",
              ],
            },
            {
              title: "Sécurité & Crypto",
              items: [
                "Chiffrement AES-ECB pour authentification",
                "Signature HMAC-SHA1 sur chaque requête API",
                "Azure Key Vault pour secrets (partner_k, partner_s, utf8_token)",
                "Headers X-Partner-Access-Token et X-Cwallet-Timestamp",
              ],
            },
            {
              title: "Multi-Tenant",
              items: [
                "Support 8+ enseignes avec thèmes personnalisés",
                "Configs par tenant (Carrefour, Tigros, Aldi, S&P...)",
                "Branding et couleurs dynamiques",
                "i18next pour internationalisation",
              ],
            },
            {
              title: "Cloud & CI/CD",
              items: [
                "Azure App Service pour hébergement",
                "Azure DevOps pour CI/CD",
                "Branch main → Staging, Tags → Production",
                "Couverture tests ~73% avec 260+ fichiers",
              ],
            },
          ],
          features: [
            {
              title: "Jeux de Fidélité",
              description:
                "4 types de jeux : Casino (roulette/dés), Scratch (cartes à gratter), Wheel (roue de la fortune), Flip (retournement de cartes)",
              icon: "🎰",
            },
            {
              title: "Auth Cryptée",
              description:
                "Login via email ou holder_ref avec chiffrement AES-ECB et signature HMAC-SHA1, gestion tokens sécurisée",
              icon: "🔐",
            },
            {
              title: "Gestion des Offres",
              description:
                "Récupération offres par code EAN, tagging produits, panier d'achat membre, bannières promotionnelles spotlight",
              icon: "🏷️",
            },
            {
              title: "Mode In-Store",
              description:
                "Upload et validation tickets de caisse, scanner QR/codes-barres, résultats jeux en magasin",
              icon: "🏪",
            },
            {
              title: "Multi-Retailers",
              description:
                "8+ enseignes supportées avec thèmes personnalisés, configs tenant-specific, branding dynamique",
              icon: "🛒",
            },
            {
              title: "API Complète",
              description:
                "Endpoints auth, offres, jeux, résultats e-commerce/instore, spotlight - toutes requêtes signées HMAC",
              icon: "🔌",
            },
          ],
          challenges: [
            "Architecture BFF sécurisée avec signature HMAC-SHA1 et chiffrement AES pour toutes les communications",
            "Système multi-tenant avec personnalisation complète (thèmes, configs) pour 8+ enseignes retail",
            "Intégration mode e-commerce et in-store (tickets de caisse) dans une expérience unifiée",
            "Couverture tests extensive (~73%, 260+ fichiers) avec Vitest, Jest et MSW",
          ],
          metrics: [
            { label: "Enseignes", value: "8+" },
            { label: "Types de jeux", value: "4" },
            { label: "Couverture tests", value: "~73%" },
            { label: "Fichiers tests", value: "260+" },
          ],
        },
      },
      {
        name: "Timtle - Location Immobilière",
        description:
          "Application mobile React Native de digitalisation du parcours locatif, simplifiant la gestion des dossiers candidats et la planification des visites pour les agences immobilières.",
        tech: [
          "React Native",
          "TypeScript",
          "Expo",
          "REST API",
          "Push Notifications",
          "Signature Électronique",
        ],
        details: {
          overview:
            "Timtle est une solution digitale innovante qui simplifie et digitalise le processus de location immobilière. Fondée début 2023, la plateforme répond aux problématiques rencontrées par les gestionnaires immobiliers et les candidats locataires. L'application se compose de deux interfaces mobiles distinctes : une pour les agences immobilières et une pour les locataires, toutes deux conçues avec un design intuitif et une expérience utilisateur simplifiée.",
          architecture: [
            {
              title: "Framework & Mobile",
              items: [
                "React Native pour iOS et Android",
                "TypeScript pour la robustesse du code",
                "Deux applications distinctes : Agence et Locataire",
                "Design UX/UI optimisé pour chaque audience",
              ],
            },
            {
              title: "Fonctionnalités Métier",
              items: [
                "Synchronisation automatique des annonces depuis les portails immobiliers",
                "Centralisation des dossiers candidats par bien",
                "Système de planification des visites intégré",
                "Suivi en temps réel du statut de chaque bien",
              ],
            },
            {
              title: "Gestion Documentaire",
              items: [
                "Constitution de dossier locataire digital",
                "Upload et validation des pièces justificatives",
                "Signature électronique du bail",
                "Gestion des attestations d'assurance",
              ],
            },
            {
              title: "Backend & Services",
              items: [
                "API REST pour synchronisation des données",
                "Intégration portails immobiliers majeurs",
                "Notifications push pour le suivi",
                "Stockage sécurisé des documents",
              ],
            },
          ],
          features: [
            {
              title: "Gestion des Biens",
              description:
                "Suivi centralisé de tous les biens en location sur les différentes plateformes, visibilité en temps réel du statut locatif de chaque propriété",
              icon: "🏠",
            },
            {
              title: "Dossiers Candidats",
              description:
                "Consolidation automatique des dossiers de candidature par bien, avec tous les documents justificatifs nécessaires",
              icon: "📁",
            },
            {
              title: "Planification des Visites",
              description:
                "Système de calendrier intégré pour optimiser l'organisation des visites et réduire les tâches chronophages",
              icon: "📅",
            },
            {
              title: "Signature Électronique",
              description:
                "Finalisation des locations avec confirmation d'intérêt, fourniture des documents d'assurance et signature électronique du bail",
              icon: "✍️",
            },
            {
              title: "App Locataire",
              description:
                "Interface dédiée permettant aux candidats de constituer leur dossier, suivre leurs candidatures et signer leur bail",
              icon: "👤",
            },
            {
              title: "App Agence",
              description:
                "Interface professionnelle pour gérer le portefeuille de biens, traiter les candidatures et optimiser le temps de mise en location",
              icon: "🏢",
            },
          ],
          challenges: [
            "Conception UX/UI de deux applications mobiles distinctes avec des parcours utilisateurs différents",
            "Intégration avec les portails immobiliers majeurs pour synchronisation automatique des annonces",
            "Workflow complet de location : de la candidature à la signature électronique du bail",
            "Réduction significative des tâches chronophages et non productives pour les agences",
          ],
          metrics: [
            { label: "Apps", value: "2" },
            { label: "Plateformes", value: "iOS/Android" },
            { label: "Portails", value: "Intégrés" },
            { label: "Signature", value: "Électronique" },
          ],
        },
      },
    ],
  },
  {
    id: "freelance",
    company: "Freelance",
    role: "Développeur Indépendant",
    period: "Jan 2019 - Aujourd'hui",
    startYear: 2019,
    endYear: null,
    color: "#059669", // Vert
    row: "bottom",
    projects: [
      {
        name: "Tchee - Application VTC",
        description:
          "Plateforme VTC complète (type Uber) pour le marché africain avec app mobile passager/chauffeur, backend API et backoffice admin. Paiements multi-providers (Stripe, Orange Money, Wave).",
        tech: [
          "React Native",
          "Expo",
          "TypeScript",
          "React Router",
          "Prisma",
          "MySQL",
          "Stripe",
          "Firebase",
          "Google Maps",
        ],
        details: {
          overview:
            "Tchee est une application de VTC (transport de personnes) complète de type Uber, conçue pour le marché africain. La plateforme se compose de 3 parties distinctes : une application mobile React Native pour passagers et chauffeurs, un backend API Node.js, et un backoffice d'administration. Elle supporte les paiements par carte (Stripe), espèces et Mobile Money (Orange Money, MTN, Moov, Wave).",
          architecture: [
            {
              title: "App Mobile (Expo)",
              items: [
                "Expo 54 + React Native 0.81 cross-platform iOS/Android",
                "TypeScript 5.9 pour typage statique",
                "Expo Router 6.0 pour navigation file-based",
                "Google Maps API + Places pour géolocalisation",
              ],
            },
            {
              title: "Backend API (Node.js)",
              items: [
                "React Router 7.9 full-stack SSR",
                "Prisma 6.18 ORM avec MySQL",
                "49 routes API REST (auth, trips, payments, documents)",
                "JWT 30 jours + bcrypt pour authentification",
              ],
            },
            {
              title: "BackOffice Admin",
              items: [
                "React 19 + React Router 7.9 SSR",
                "Tailwind CSS 4.1 pour le styling",
                "Dashboard : courses, paiements, utilisateurs",
                "Validation documents chauffeurs (permis, assurance)",
              ],
            },
            {
              title: "Paiements & Notifications",
              items: [
                "Stripe pour cartes bancaires + webhooks",
                "Mobile Money : Orange Money, MTN, Moov, Wave",
                "Firebase Cloud Messaging pour push notifications",
                "Calcul tarifs dynamique avec heures de pointe",
              ],
            },
          ],
          features: [
            {
              title: "Côté Passager",
              description:
                "Recherche destination (Google Places), calcul itinéraire, création course, suivi temps réel du chauffeur sur carte, historique courses et portefeuille",
              icon: "🚗",
            },
            {
              title: "Côté Chauffeur",
              description:
                "Onboarding complet (documents, véhicule, photos), mode actif pour recevoir courses, gestion courses, finances avec revenus et commissions",
              icon: "🚕",
            },
            {
              title: "Paiements Multi-Providers",
              description:
                "Carte bancaire (Stripe), espèces, Mobile Money (Orange Money, MTN, Moov, Wave) avec webhooks de confirmation",
              icon: "💳",
            },
            {
              title: "Suivi Temps Réel",
              description:
                "Position chauffeur en direct sur carte, cycle de vie course (pending → accepted → in_progress → completed), notifications push",
              icon: "📍",
            },
            {
              title: "BackOffice Admin",
              description:
                "Dashboard 3 onglets (courses, paiements, utilisateurs), validation documents chauffeurs, paramètres commission (15%) et tarifs",
              icon: "🖥️",
            },
            {
              title: "Tarification Dynamique",
              description:
                "Base 500 XOF + 50 XOF/min + 100 XOF/km, commission 15%, multiplicateur heures de pointe 1.5x (7h-9h, 17h-19h)",
              icon: "💰",
            },
          ],
          challenges: [
            "Architecture 3-tiers complète : App Mobile + Backend API + BackOffice communiquant via REST/JWT",
            "Intégration paiements multiples adaptés au marché africain (Mobile Money dominant)",
            "Suivi GPS temps réel avec optimisation batterie et calcul d'itinéraires Google Maps",
            "Workflow validation documents chauffeurs avec gestion états (pending → approved/rejected)",
          ],
          metrics: [
            { label: "Composants", value: "3" },
            { label: "Routes API", value: "49" },
            { label: "Paiements", value: "4 types" },
            { label: "Plateformes", value: "iOS/Android" },
          ],
        },
      },
      {
        name: "SayYes - Portfolio & Landing Builder",
        description:
          "Plateforme de gestion de portfolios et landing pages dynamiques pour agences créatives avec animations avancées et CMS modulaire.",
        tech: [
          "Remix",
          "React 18",
          "TypeScript",
          "Tailwind CSS",
          "Prisma",
          "SQLite",
          "Framer Motion",
          "Three.js",
          "Vite",
          "PWA",
        ],
        details: {
          overview:
            "SayYes est une plateforme de gestion de portfolios et de landing pages dynamiques, conçue pour des agences créatives ou studios digitaux. L'application permet de présenter des réalisations clients avec des animations avancées (Framer Motion, Three.js) et de créer des pages d'atterrissage personnalisables via un système de blocs modulaires.",
          architecture: [
            {
              title: "Frontend & Framework",
              items: [
                "React 18 avec SSR via Remix",
                "TypeScript strict pour la robustesse du code",
                "Tailwind CSS pour le design system",
                "Framer Motion + Three.js pour les animations",
                "Vite comme build tool avec support PWA",
              ],
            },
            {
              title: "Backend & API",
              items: [
                "Remix (SSR + file-based routing)",
                "Loaders pour le chargement de données",
                "Actions pour les mutations",
                "Nodemailer (SMTP Brevo) pour les emails",
              ],
            },
            {
              title: "Base de Données",
              items: [
                "SQLite pour la persistance",
                "Prisma ORM avec migrations versionnées",
                "Modèles : Portfolio, Media, LandingPage, Solution",
                "Relations cascade delete pour les médias",
              ],
            },
            {
              title: "Performance & PWA",
              items: [
                "Service Worker avec cache offline (50MB)",
                "Code splitting pour les SVG volumineux",
                "Sharp pour l'optimisation d'images",
                "Lazy loading avec Intersection Observer",
              ],
            },
          ],
          features: [
            {
              title: "Builder Landing Pages",
              description:
                "Système de blocs modulaires : blocIntro, cards, chiffresCles, testimonial, methods, faq, useCase, footer - Configuration visuelle par bloc",
              icon: "🏗️",
            },
            {
              title: "Gestion Portfolios",
              description:
                "CRUD complet avec éditeur WYSIWYG, upload médias drag & drop, grille Bento flexible, SEO intégré (meta tags, schema.org)",
              icon: "📁",
            },
            {
              title: "Animations Avancées",
              description:
                "FadeInView au scroll, parallax, smooth scroll (Lenis), gradients holographiques, halos, textures, titres avec gradient animé",
              icon: "✨",
            },
            {
              title: "Admin Dashboard",
              description:
                "Interface d'administration complète : gestion portfolios, builder landing pages, preview temps réel, configuration SEO",
              icon: "⚙️",
            },
            {
              title: "PWA & Offline",
              description:
                "Application installable, cache offline stratégie CacheFirst, support prefers-reduced-motion pour l'accessibilité",
              icon: "📱",
            },
            {
              title: "SEO Optimisé",
              description:
                "SSR complet pour le référencement, meta tags dynamiques, schema.org JSON-LD intégré, slugs personnalisables",
              icon: "🔍",
            },
          ],
          challenges: [
            "Système de blocs modulaires réutilisables avec configuration JSON et preview temps réel",
            "Polyfill CSS @property pour Safari iOS avec fallback JavaScript pour les gradients animés",
            "Architecture TypeScript robuste avec types bien définis pour le système de blocs",
            "Optimisation performance : SSR, code splitting, image optimization, PWA caching",
          ],
          metrics: [
            { label: "Types blocs", value: "12" },
            { label: "Lighthouse", value: "95+" },
            { label: "SSR", value: "100%" },
            { label: "PWA", value: "Installable" },
          ],
        },
      },
      {
        name: "Guardian - DeFi Smart Accounts",
        description:
          "Gestionnaire de fonds autonome pour Monad Testnet avec Smart Accounts MetaMask, délégations réutilisables et agent IA de recommandation de stratégies.",
        tech: [
          "Remix",
          "React 18",
          "TypeScript",
          "Three.js",
          "Prisma",
          "viem",
          "wagmi",
          "MetaMask Delegation Toolkit",
          "ZeroDev SDK",
          "Pimlico",
          "Envio",
        ],
        details: {
          overview:
            "Guardian est un gestionnaire de fonds autonome développé pour le hackathon Monad x MetaMask Smart Accounts. L'application combine Smart Accounts avec déploiement CREATE2 déterministe, délégations réutilisables (signature unique pour jobs multiples), un agent IA avec scoring multi-stratégies, et automatisation DCA. Architecture de 174 fichiers TypeScript et 36,500+ lignes de code.",
          architecture: [
            {
              title: "Frontend & UI",
              items: [
                "Remix 2.0 avec React 18 et TypeScript",
                "Three.js pour visualisations 3D",
                "Framer Motion pour animations fluides",
                "Tailwind CSS pour le design system",
                "9 contextes React (balances, tokens, modals...)",
              ],
            },
            {
              title: "Backend & API",
              items: [
                "Express 4.18 comme serveur HTTP",
                "Prisma ORM avec SQLite",
                "28 modules serveur (10,300+ lignes)",
                "50+ endpoints API REST",
              ],
            },
            {
              title: "Blockchain & Web3",
              items: [
                "viem 2.x + wagmi 2.17 pour interactions blockchain",
                "MetaMask Delegation Toolkit 0.13 pour Smart Accounts",
                "ZeroDev SDK 5.5 pour Account Abstraction",
                "Pimlico comme Bundler ERC-4337",
              ],
            },
            {
              title: "Indexation & Data",
              items: [
                "Envio HyperIndex + HyperSync pour indexation",
                "Token Discovery avec CoinMarketCap API",
                "Prix temps réel multi-sources avec fallback",
                "Cache persistant pour logos et métadonnées",
              ],
            },
          ],
          features: [
            {
              title: "Agent Brain IA",
              description:
                "Moteur de décision évaluant 4 stratégies (staking, DCA, hold, compound) avec scoring 0-100 basé sur volatilité, volume, liquidité et APY estimé",
              icon: "🧠",
            },
            {
              title: "Délégations Réutilisables",
              description:
                "Signature unique pour exécutions multiples, Smart Accounts CREATE2 avec auto-déploiement, scopes smartSession et functionCall",
              icon: "🔐",
            },
            {
              title: "Scheduler DCA",
              description:
                "Planificateur en mémoire pour Dollar Cost Averaging automatique, persistance disque, arrêt auto à expiration, suivi temps réel",
              icon: "⏱️",
            },
            {
              title: "Token Discovery",
              description:
                "Pipeline autonome : Envio HyperSync → Scan Swap events → DB → Enrichissement CoinMarketCap, score confiance 0-4 étoiles",
              icon: "🔍",
            },
            {
              title: "Smart Harvest",
              description:
                "Workflow principal : évaluation marché → recommandation IA → soumission délégation → job DCA automatisé",
              icon: "🌾",
            },
            {
              title: "Auth SIWE",
              description:
                "Sign-In With Ethereum : connexion wallet, nonce serveur, vérification signature, session cookie sécurisée",
              icon: "🔑",
            },
          ],
          challenges: [
            "Smart Accounts avec déploiement CREATE2 déterministe et première transaction = déploiement + exécution atomique",
            "Délégations réutilisables éliminant la friction de re-signature pour jobs DCA récurrents",
            "Intégration Envio avec optimisation 50x via batching et filtrage intelligent (99% réduction événements)",
            "Agent IA avec raisonnement explicite et niveau de confiance pour chaque recommandation",
          ],
          metrics: [
            { label: "Fichiers TS", value: "174" },
            { label: "Lignes code", value: "36K+" },
            { label: "Endpoints", value: "50+" },
            { label: "Stratégies IA", value: "4" },
          ],
        },
      },
    ],
  },
];

// Années sur la timeline
const TIMELINE_START = 2019;
const TIMELINE_END = 2026;
const TIMELINE_WIDTH = 12; // Largeur totale de la timeline

function yearToX(year: number): number {
  const progress = (year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START);
  return -TIMELINE_WIDTH / 2 + progress * TIMELINE_WIDTH;
}

interface ExperienceBlockProps {
  experience: Experience;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}

function ExperienceBlock({
  experience,
  isSelected,
  onSelect,
}: ExperienceBlockProps) {
  const { t } = useTranslation("common");
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const startX = yearToX(experience.startYear);
  const endX = yearToX(experience.endYear || TIMELINE_END);
  const naturalWidth = endX - startX;
  const yPos = experience.row === "top" ? 1.2 : -1.2;
  // Use natural width but with a minimum for readability
  const blockWidth = Math.max(naturalWidth - 0.1, 1.2);
  // Anchor the block at its start position, extending to the right
  const centerX = startX + blockWidth / 2;

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Subtle floating animation
    groupRef.current.position.y = yPos + Math.sin(time * 0.5) * 0.05;

    // Scale on hover/select
    const targetScale = isSelected ? 1.08 : hovered ? 1.04 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onSelect(isSelected ? null : experience.id);
  };

  return (
    <group ref={groupRef} position={[centerX, yPos, 0]}>
      {/* Main block - width based on duration */}
      <RoundedBox
        args={[blockWidth, 0.9, 0.2]}
        radius={0.08}
        smoothness={4}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={experience.color}
          metalness={0.3}
          roughness={0.4}
          emissive={experience.color}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.1}
          transparent
          opacity={0.85}
        />
      </RoundedBox>

      {/* Company name - single word, big and readable with shuffle effect */}
      <MorphingText3D
        position={[0, 0, 0.15]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {experience.id === "etude" ? t("experience.study") : experience.company}
      </MorphingText3D>

      {/* Vertical connector to timeline */}
      <mesh position={[0, experience.row === "top" ? -0.6 : 0.6, -0.05]}>
        <boxGeometry args={[0.03, 0.4, 0.03]} />
        <meshBasicMaterial color={experience.color} opacity={0.6} transparent />
      </mesh>

      {/* Glow effect when selected */}
      {isSelected && (
        <pointLight color={experience.color} intensity={1.5} distance={3} />
      )}
    </group>
  );
}

// Timeline title with shuffle effect
function TimelineTitle({
  position,
  title,
  subtitle,
}: {
  position: [number, number, number];
  title: string;
  subtitle: string;
}) {
  return (
    <Float rotationIntensity={0.02} floatIntensity={0.05} speed={2}>
      <group position={position}>
        <MorphingText3D
          fontSize={0.35}
          color="#06b6d4"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {title}
        </MorphingText3D>
        <MorphingText3D
          position={[0, -0.45, 0]}
          fontSize={0.12}
          color="rgba(255,255,255,0.5)"
          anchorX="center"
          anchorY="middle"
          fontWeight="normal"
        >
          {subtitle}
        </MorphingText3D>
      </group>
    </Float>
  );
}

// Year markers on timeline
function YearMarkers() {
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  return (
    <group>
      {years.map((year) => {
        const x = yearToX(year);
        return (
          <group key={year} position={[x, 0, 0]}>
            {/* Vertical tick */}
            <mesh position={[0, 0, -0.05]}>
              <boxGeometry args={[0.02, 0.3, 0.02]} />
              <meshBasicMaterial color="#06b6d4" opacity={0.5} transparent />
            </mesh>
            {/* Year label */}
            <Text
              position={[0, -0.35, 0]}
              fontSize={0.15}
              color="rgba(255,255,255,0.6)"
              anchorX="center"
              anchorY="middle"
            >
              {year.toString()}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

interface Timeline3DProps {
  onExperienceSelect: (experience: Experience | null) => void;
  selectedId: string | null;
}

export default function Timeline3D({
  onExperienceSelect,
  selectedId,
}: Timeline3DProps) {
  const { t } = useTranslation("common");

  const handleSelect = (id: string | null) => {
    if (id) {
      const exp = experienceData.find((e) => e.id === id);
      onExperienceSelect(exp || null);
    } else {
      onExperienceSelect(null);
    }
  };

  // Position on circle at experience section angle (72° = 2π/5)
  const angle = SECTION_ANGLES.experience;
  const posX = Math.sin(angle) * ORBIT_RADIUS;
  const posZ = Math.cos(angle) * ORBIT_RADIUS;
  // Rotate to be tangent to circle and face outward (toward where camera will be)
  // Content at angle θ needs rotation θ to face outward
  // When RotatingWorld rotates by -θ, the content ends up at angle 0 with rotation 0
  // (θ + (-θ) = 0), so it faces the camera on the +Z axis
  const rotationY = angle;

  return (
    <group position={[posX, 0, posZ]} rotation={[0, rotationY, 0]} scale={1.15}>
      {/* Title */}
      <TimelineTitle
        position={[0, 3, 0]}
        title={t("timeline.professionalExperience")}
        subtitle={t("timeline.clickToSeeProjects")}
      />

      {/* Main horizontal timeline line */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[TIMELINE_WIDTH + 1, 0.04, 0.04]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.4} transparent />
      </mesh>

      {/* Arrow at the end (right) */}
      <mesh
        position={[TIMELINE_WIDTH / 2 + 0.7, 0, -0.1]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[0.1, 0.25, 8]} />
        <meshBasicMaterial color="#06b6d4" opacity={0.6} transparent />
      </mesh>

      {/* Year markers */}
      <YearMarkers />

      {/* Experience blocks */}
      {experienceData.map((exp) => (
        <ExperienceBlock
          key={exp.id}
          experience={exp}
          isSelected={selectedId === exp.id}
          onSelect={handleSelect}
        />
      ))}

    </group>
  );
}
