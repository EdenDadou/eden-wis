export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  title?: string;
}

export interface ProjectSection {
  key: string;
  media?: ProjectMedia[];
}

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey: string;
  tags: string[];
  color: string;
  accentColor: string;
  image: string;
  icon?: string;
  mockups: string[];
  videos?: { src: string; title: string }[];
  sections?: ProjectSection[];
  year: string;
  duration: string;
  client: string;
  role: string;
  stats: { label: string; value: string }[];
  type: "web" | "mobile" | "dashboard";
}
