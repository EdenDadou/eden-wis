import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "nova-fashion",
    titleKey: "portfolio.projects.novaFashion.title",
    descriptionKey: "portfolio.projects.novaFashion.description",
    longDescriptionKey: "portfolio.projects.novaFashion.longDescription",
    tags: ["Next.js 14", "Stripe", "PostgreSQL", "Tailwind CSS", "Elasticsearch", "Redis"],
    color: "#8B5CF6",
    accentColor: "#C4B5FD",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    mockups: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    ],
    year: "2024",
    duration: "4 mois",
    client: "Nova Fashion Group",
    role: "Lead Developer",
    stats: [
      { label: "Conversion", value: "+340%" },
      { label: "Lighthouse", value: "98/100" },
      { label: "Users", value: "50K+" },
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
        key: "passenger",
        media: [
          { type: "image", src: "/images/portfolio/tchee/tchee-2.png", title: "Recherche d'adresse" },
          { type: "image", src: "/images/portfolio/tchee/tchee-3.png", title: "Estimation du trajet" },
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
        key: "driver",
        media: [
          { type: "image", src: "/images/portfolio/tchee/tchee-6.png", title: "Interface chauffeur" },
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
        key: "technical",
      },
    ],
    year: "2025",
    duration: "6 mois",
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
