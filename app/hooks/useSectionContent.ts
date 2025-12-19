import { useTranslation } from "react-i18next";

export interface SectionContent {
  title: string;
  subtitle: string;
  category: string;
  items?: string[];
}

export function useSectionContent(section: number): SectionContent {
  const { t } = useTranslation("common");

  const sectionContent: Record<number, SectionContent> = {
    0: {
      title: t("home.name"),
      subtitle: t("cards.hero.title"),
      category: t("sections.introduction"),
      items: [
        t("content.intro.passionateDev"),
        t("content.intro.customSolutions"),
        t("content.intro.fromConceptToDeployment"),
      ],
    },
    1: {
      title: t("content.fullstack.title"),
      subtitle: t("content.fullstack.subtitle"),
      category: t("sections.overview"),
      items: t("content.fullstack.items", { returnObjects: true }) as string[],
    },
    2: {
      title: t("content.frontend.title"),
      subtitle: t("content.frontend.subtitle"),
      category: t("sections.interface"),
      items: t("content.frontend.items", { returnObjects: true }) as string[],
    },
    3: {
      title: t("content.siteWeb.title"),
      subtitle: t("content.siteWeb.subtitle"),
      category: t("sections.frontend"),
      items: t("content.siteWeb.items", { returnObjects: true }) as string[],
    },
    4: {
      title: t("content.mobile.title"),
      subtitle: t("content.mobile.subtitle"),
      category: t("sections.mobile"),
      items: t("content.mobile.items", { returnObjects: true }) as string[],
    },
    5: {
      title: t("content.backoffice.title"),
      subtitle: t("content.backoffice.subtitle"),
      category: t("sections.administration"),
      items: t("content.backoffice.items", { returnObjects: true }) as string[],
    },
    6: {
      title: t("content.backend.title"),
      subtitle: t("content.backend.subtitle"),
      category: t("sections.server"),
      items: t("content.backend.items", { returnObjects: true }) as string[],
    },
    7: {
      title: t("content.server.title"),
      subtitle: t("content.server.subtitle"),
      category: t("sections.backend"),
      items: t("content.server.items", { returnObjects: true }) as string[],
    },
    8: {
      title: t("content.database.title"),
      subtitle: t("content.database.subtitle"),
      category: t("sections.data"),
      items: t("content.database.items", { returnObjects: true }) as string[],
    },
    9: {
      title: t("content.devops.title"),
      subtitle: t("content.devops.subtitle"),
      category: t("sections.devops"),
      items: t("content.devops.items", { returnObjects: true }) as string[],
    },
    10: {
      title: t("content.cicd.title"),
      subtitle: t("content.cicd.subtitle"),
      category: t("sections.pipeline"),
      items: t("content.cicd.items", { returnObjects: true }) as string[],
    },
    11: {
      title: t("content.cloud.title"),
      subtitle: t("content.cloud.subtitle"),
      category: t("sections.hosting"),
      items: t("content.cloud.items", { returnObjects: true }) as string[],
    },
    12: {
      title: t("content.architecture.title"),
      subtitle: t("content.architecture.subtitle"),
      category: t("sections.design"),
      items: t("content.architecture.items", { returnObjects: true }) as string[],
    },
    13: {
      title: t("content.experience.title"),
      subtitle: t("content.experience.subtitle"),
      category: t("sections.timelineSection"),
      items: t("content.experience.items", { returnObjects: true }) as string[],
    },
    14: {
      title: t("portfolio.heading"),
      subtitle: t("portfolio.subtitle"),
      category: t("portfolio.title"),
      items: [
        t("portfolio.projects.novaFashion.title"),
        t("portfolio.projects.pulseAnalytics.title"),
        t("portfolio.projects.swiftDelivery.title"),
      ],
    },
  };

  return sectionContent[section] || sectionContent[0];
}
