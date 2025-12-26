import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "sayyes",
    titleKey: "portfolio.projects.sayyes.title",
    descriptionKey: "portfolio.projects.sayyes.description",
    longDescriptionKey: "portfolio.projects.sayyes.longDescription",
    tags: ["Remix", "React 18", "TypeScript", "Tailwind CSS", "Prisma", "Three.js", "Framer Motion", "SQLite"],
    color: "#4F0BAC",
    accentColor: "#9B5DE5",
    image: "/images/portfolio/sayyes/sayyes-home.png",
    presentationVideo: "/images/portfolio/sayyes/presentation.mov",
    icon: "/images/portfolio/sayyes/icon.svg",
    mockups: [
      "/images/portfolio/sayyes/sayyes-portfolio.png",
      "/images/portfolio/sayyes/sayyes-backoffice.png",
    ],
    videos: [
      { src: "/images/portfolio/sayyes/galerie-portfolio.mov", title: "Galerie Portfolio" },
      { src: "/images/portfolio/sayyes/projet-portfolio.mov", title: "Projet Portfolio" },
      { src: "/images/portfolio/sayyes/sayyes-landing.mov", title: "Landing Pages" },
      { src: "/images/portfolio/sayyes/layout-animation.mov", title: "Animations Layout" },
      { src: "/images/portfolio/sayyes/admin-projet-portfolio.mov", title: "Admin Portfolio" },
      { src: "/images/portfolio/sayyes/admin-seo.mov", title: "Admin SEO" },
      { src: "/images/portfolio/sayyes/sayyes-mobile.mov", title: "Vue Mobile" },
    ],
    sections: [
      {
        key: "design",
      },
      {
        key: "overview",
        media: [
          { type: "image", src: "/images/portfolio/sayyes/sayyes-home.png", title: "Page d'accueil" },
          { type: "video", src: "/images/portfolio/sayyes/layout-animation.mov", title: "Animations Layout" },
        ],
      },
      {
        key: "portfolio",
        media: [
          { type: "video", src: "/images/portfolio/sayyes/galerie-portfolio.mov", title: "Galerie Portfolio" },
          { type: "video", src: "/images/portfolio/sayyes/projet-portfolio.mov", title: "Vue détail projet" },
        ],
      },
      {
        key: "landingBuilder",
        media: [
          { type: "video", src: "/images/portfolio/sayyes/sayyes-landing.mov", title: "Constructeur de landing pages" },
        ],
      },
      {
        key: "backoffice",
        media: [
          { type: "image", src: "/images/portfolio/sayyes/sayyes-backoffice.png", title: "Back-office admin" },
          { type: "video", src: "/images/portfolio/sayyes/admin-projet-portfolio.mov", title: "Gestion des projets" },
          { type: "video", src: "/images/portfolio/sayyes/admin-seo.mov", title: "Gestion SEO" },
        ],
      },
      {
        key: "bentoGrid",
      },
      {
        key: "performance",
      },
      {
        key: "technical",
        media: [
          { type: "video", src: "/images/portfolio/sayyes/sayyes-mobile.mov", title: "Vue Mobile Responsive" },
        ],
      },
      {
        key: "architecture",
        media: [
          { type: "image", src: "/images/portfolio/sayyes/architecture.svg", title: "Architecture Full-Stack" },
        ],
      },
    ],
    year: "2024",
    duration: "3 mois",
    team: "1 personne",
    client: "SayYes Agency",
    role: "Lead Developer Full-Stack",
    stats: [
      { label: "Blocs", value: "7 types" },
      { label: "Cache", value: "2 layers" },
      { label: "Lighthouse", value: "95+" },
    ],
    type: "web",
  },
  {
    id: "pulse-analytics",
    titleKey: "portfolio.projects.pulseAnalytics.title",
    descriptionKey: "portfolio.projects.pulseAnalytics.description",
    longDescriptionKey: "portfolio.projects.pulseAnalytics.longDescription",
    tags: ["React 18", "Node.js", "MongoDB", "D3.js", "WebSocket", "Docker"],
    color: "#06B6D4",
    accentColor: "#67E8F9",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    mockups: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
    ],
    year: "2024",
    duration: "6 mois",
    client: "Pulse Technologies",
    role: "Full-Stack Architect",
    stats: [
      { label: "Events/s", value: "10K+" },
      { label: "Uptime", value: "99.99%" },
      { label: "Clients", value: "120+" },
    ],
    type: "dashboard",
  },
  {
    id: "tchee",
    titleKey: "portfolio.projects.tchee.title",
    descriptionKey: "portfolio.projects.tchee.description",
    longDescriptionKey: "portfolio.projects.tchee.longDescription",
    tags: ["React Native", "Expo", "React Router", "Stripe", "Orange Money", "MySQL", "Google Maps", "Firebase", "GitHub Actions"],
    color: "#5DD3F3",
    accentColor: "#A7E8F9",
    image: "/images/portfolio/tchee/tchee-1.png",
    icon: "/images/portfolio/tchee/icon.png",
    mockups: [
      "/images/portfolio/tchee/tchee-2.png",
      "/images/portfolio/tchee/tchee-3.png",
      "/images/portfolio/tchee/tchee-4.png",
      "/images/portfolio/tchee/tchee-5.png",
      "/images/portfolio/tchee/tchee-6.png",
      "/images/portfolio/tchee/tchee-7.png",
      "/images/portfolio/tchee/tchee-dashboard-users.png",
    ],
    videos: [
      { src: "/images/portfolio/tchee/tchee-dashboard.mov", title: "Dashboard Admin" },
      { src: "/images/portfolio/tchee/tchee-notif-push.mov", title: "Notifications Push" },
      { src: "/images/portfolio/tchee/tchee-orange-payment.mov", title: "Paiement Orange Money" },
    ],
    sections: [
      {
        key: "overview",
        media: [
          { type: "image", src: "/images/portfolio/tchee/tchee-1.png", title: "Écran d'accueil" },
        ],
      },
      {
        key: "mobileApp",
        media: [
          { type: "image", src: "/images/portfolio/tchee/tchee-2.png", title: "Recherche d'adresse" },
          { type: "image", src: "/images/portfolio/tchee/tchee-3.png", title: "Estimation du trajet" },
          { type: "image", src: "/images/portfolio/tchee/tchee-6.png", title: "Interface chauffeur" },
        ],
      },
      {
        key: "tracking",
        media: [
          { type: "image", src: "/images/portfolio/tchee/tchee-4.png", title: "Suivi du chauffeur" },
          { type: "image", src: "/images/portfolio/tchee/tchee-5.png", title: "Trajet en cours" },
        ],
      },
      {
        key: "payments",
        media: [
          { type: "video", src: "/images/portfolio/tchee/tchee-orange-payment.mov", title: "Paiement Orange Money" },
        ],
      },
      {
        key: "dashboard",
        media: [
          { type: "image", src: "/images/portfolio/tchee/tchee-7.png", title: "Dashboard gains" },
        ],
      },
      {
        key: "notifications",
        media: [
          { type: "video", src: "/images/portfolio/tchee/tchee-notif-push.mov", title: "Notifications push en action" },
        ],
      },
      {
        key: "admin",
        media: [
          { type: "video", src: "/images/portfolio/tchee/tchee-dashboard.mov", title: "Dashboard administrateur" },
          { type: "image", src: "/images/portfolio/tchee/tchee-dashboard-users.png", title: "Gestion des utilisateurs" },
        ],
      },
      {
        key: "cicd",
        media: [
          { type: "image", src: "/images/portfolio/tchee/cicd.png", title: "Pipeline CI/CD" },
        ],
      },
      {
        key: "stores",
      },
      {
        key: "technical",
      },
    ],
    year: "2025",
    duration: "4 mois",
    team: "1 personne",
    client: "Tchee",
    role: "Lead Developer Full-Stack",
    stats: [
      { label: "Paiements", value: "3 types" },
      { label: "Platforms", value: "iOS/Android" },
      { label: "APIs", value: "20+" },
    ],
    type: "mobile",
  },
];
