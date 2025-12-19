export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey: string;
  tags: string[];
  color: string;
  accentColor: string;
  image: string;
  mockups: string[];
  year: string;
  duration: string;
  client: string;
  role: string;
  stats: { label: string; value: string }[];
  type: "web" | "mobile" | "dashboard";
}
