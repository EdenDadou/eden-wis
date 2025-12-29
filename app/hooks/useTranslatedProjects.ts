import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import type {
  Project,
  ProjectDetails,
  ProjectArchitecture,
  ProjectFeature,
} from "~/components/Timeline3D";

// Mapping des identifiants de projets vers les clés de traduction
const PROJECT_TRANSLATION_KEYS: Record<string, string> = {
  "OPPBTP : PreventionBTP v3": "preventionbtp",
  "Au Vieux Campeur - App Mobile v2": "avc",
  "OPPBTP : Bonnes Pratiques Cordiste": "cordiste",
  "GoCrisis - Gestion de Crise": "gocrisis",
  "Catalina - Fidélité Gamifiée Retail": "catalina",
  "Timtle - Location Immobilière": "timtle",
  "Elistair - Portail Client Drones": "elistair",
  "Beager - Plateforme Freelance v2": "beager",
  "Tchee - Application VTC": "tchee",
  "SayYes - Portfolio & Landing Builder": "sayyes",
  "Guardian - DeFi Smart Accounts": "guardian",
};

// Projets freelance (utilisent freelanceProjects au lieu de atecnaProjects)
const FREELANCE_PROJECTS = new Set(["tchee", "sayyes", "guardian"]);

// Mapping des clés d'architecture par projet
const ARCHITECTURE_KEYS: Record<string, string[]> = {
  preventionbtp: ["frontend", "backend", "cms", "infrastructure"],
  avc: ["framework", "ui", "state", "backend"],
  cordiste: ["framework", "cms", "forms", "auth"],
  gocrisis: ["framework", "state", "ui", "backend"],
  catalina: ["monorepo", "security", "multiTenant", "cloud"],
  timtle: ["framework", "features", "documents", "backend"],
  elistair: ["frontend", "backend", "security", "infrastructure"],
  beager: ["frontend", "backend", "documents", "infrastructure"],
  tchee: ["mobile", "backend", "backoffice", "payments"],
  sayyes: ["frontend", "backend", "database", "performance"],
  guardian: ["frontend", "backend", "blockchain", "indexation"],
};

// Mapping des clés de features par projet
const FEATURE_KEYS: Record<string, string[]> = {
  preventionbtp: ["search", "auth", "forms", "sections", "seo", "analytics"],
  avc: ["auth", "search", "shopping", "orders", "scanner", "loyalty"],
  cordiste: [
    "creation",
    "discovery",
    "multiProfession",
    "authEnterprise",
    "responsive",
    "analytics",
  ],
  gocrisis: [
    "assessment",
    "questionnaire",
    "scenarios",
    "team",
    "authSecure",
    "notifications",
  ],
  catalina: [
    "games",
    "authCrypto",
    "offers",
    "instore",
    "multiRetailer",
    "api",
  ],
  timtle: [
    "propertyManagement",
    "candidateFiles",
    "visitScheduling",
    "digitalSignature",
    "tenantApp",
    "agencyApp",
  ],
  elistair: ["fleet", "monitoring", "docs", "users", "analytics", "support"],
  beager: [
    "matching",
    "contracts",
    "verified",
    "payments",
    "dashboard",
    "freelanceSpace",
  ],
  tchee: [
    "passenger",
    "driver",
    "payments",
    "realtime",
    "admin",
    "pricing",
  ],
  sayyes: [
    "landingBuilder",
    "portfolios",
    "animations",
    "admin",
    "pwa",
    "seo",
  ],
  guardian: [
    "agentBrain",
    "delegations",
    "scheduler",
    "tokenDiscovery",
    "smartHarvest",
    "authSiwe",
  ],
};

// Emojis pour les features (restent les mêmes dans toutes les langues)
const FEATURE_ICONS: Record<string, Record<string, string>> = {
  preventionbtp: {
    search: "🔍",
    auth: "🔐",
    forms: "📝",
    sections: "📚",
    seo: "⚡",
    analytics: "📊",
  },
  avc: {
    auth: "🔐",
    search: "🔍",
    shopping: "🛒",
    orders: "📦",
    scanner: "📍",
    loyalty: "🎁",
  },
  cordiste: {
    creation: "📝",
    discovery: "🔍",
    multiProfession: "👷",
    authEnterprise: "🔐",
    responsive: "📱",
    analytics: "📊",
  },
  gocrisis: {
    assessment: "🚨",
    questionnaire: "📋",
    scenarios: "⚙️",
    team: "👥",
    authSecure: "🔐",
    notifications: "📬",
  },
  catalina: {
    games: "🎰",
    authCrypto: "🔐",
    offers: "🏷️",
    instore: "🏪",
    multiRetailer: "🛒",
    api: "🔌",
  },
  timtle: {
    propertyManagement: "🏠",
    candidateFiles: "📁",
    visitScheduling: "📅",
    digitalSignature: "✍️",
    tenantApp: "👤",
    agencyApp: "🏢",
  },
  elistair: {
    fleet: "🚁",
    monitoring: "📡",
    docs: "📋",
    users: "👥",
    analytics: "📊",
    support: "🎫",
  },
  beager: {
    matching: "🎯",
    contracts: "📄",
    verified: "✅",
    payments: "💳",
    dashboard: "📊",
    freelanceSpace: "👤",
  },
  tchee: {
    passenger: "🚗",
    driver: "🚕",
    payments: "💳",
    realtime: "📍",
    admin: "🖥️",
    pricing: "💰",
  },
  sayyes: {
    landingBuilder: "🏗️",
    portfolios: "📁",
    animations: "✨",
    admin: "⚙️",
    pwa: "📱",
    seo: "🔍",
  },
  guardian: {
    agentBrain: "🧠",
    delegations: "🔐",
    scheduler: "⏱️",
    tokenDiscovery: "🔍",
    smartHarvest: "🌾",
    authSiwe: "🔑",
  },
};

export function useTranslatedProjects() {
  const { t } = useTranslation("common");

  const translateProject = useMemo(() => {
    return (project: Project): Project => {
      const translationKey = PROJECT_TRANSLATION_KEYS[project.name];

      // Si pas de clé de traduction, retourner le projet tel quel
      if (!translationKey) {
        return project;
      }

      // Déterminer le chemin de base selon le type de projet
      const basePath = FREELANCE_PROJECTS.has(translationKey)
        ? `freelanceProjects.${translationKey}`
        : `atecnaProjects.${translationKey}`;

      // Traduire les informations de base
      const translatedProject: Project = {
        ...project,
        name: t(`${basePath}.name`, { defaultValue: project.name }),
        description: t(`${basePath}.description`, {
          defaultValue: project.description,
        }),
      };

      // Si le projet a des détails, les traduire
      if (project.details) {
        const archKeys = ARCHITECTURE_KEYS[translationKey] || [];
        const featKeys = FEATURE_KEYS[translationKey] || [];
        const featIcons = FEATURE_ICONS[translationKey] || {};

        // Traduire l'architecture
        const translatedArchitecture: ProjectArchitecture[] = archKeys.map(
          (key, index) => {
            const original = project.details?.architecture[index];
            return {
              title: t(`${basePath}.architecture.${key}.title`, {
                defaultValue: original?.title || "",
              }),
              items: (
                t(`${basePath}.architecture.${key}.items`, {
                  returnObjects: true,
                  defaultValue: original?.items || [],
                }) as string[]
              ).filter((item) => typeof item === "string"),
            };
          }
        );

        // Traduire les features
        const translatedFeatures: ProjectFeature[] = featKeys.map(
          (key, index) => {
            const original = project.details?.features[index];
            return {
              title: t(`${basePath}.features.${key}.title`, {
                defaultValue: original?.title || "",
              }),
              description: t(`${basePath}.features.${key}.description`, {
                defaultValue: original?.description || "",
              }),
              icon: featIcons[key] || original?.icon,
            };
          }
        );

        // Traduire les challenges
        const translatedChallenges = (
          t(`${basePath}.challenges`, {
            returnObjects: true,
            defaultValue: project.details.challenges || [],
          }) as string[]
        ).filter((item) => typeof item === "string");

        const translatedDetails: ProjectDetails = {
          overview: t(`${basePath}.overview`, {
            defaultValue: project.details.overview,
          }),
          architecture: translatedArchitecture,
          features: translatedFeatures,
          challenges: translatedChallenges,
          metrics: project.details.metrics, // Les métriques restent telles quelles (valeurs numériques)
        };

        translatedProject.details = translatedDetails;
      }

      return translatedProject;
    };
  }, [t]);

  const translateProjects = useMemo(() => {
    return (projects: Project[]): Project[] => {
      return projects.map(translateProject);
    };
  }, [translateProject]);

  return {
    translateProject,
    translateProjects,
  };
}
