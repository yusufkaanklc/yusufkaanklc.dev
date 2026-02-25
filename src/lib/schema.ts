const BASE_URL = "https://yusufkaanklc.dev";
const AUTHOR = {
  "@type": "Person" as const,
  name: "Yusuf Kaan Kilic",
  url: BASE_URL,
};

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function generateCollectionSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${BASE_URL}${path}`,
    author: AUTHOR,
  };
}

export function generateBreadcrumbs(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${BASE_URL}${item.path}`,
      })),
    ],
  };
}

interface ArticleSchemaInput {
  type: "BlogPosting" | "NewsArticle";
  title: string;
  summary: string;
  date: string;
  path: string;
  image?: string;
  keywords?: string;
}

export function generateArticleSchema({ type, title, summary, date, path, image, keywords }: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: title,
    description: summary,
    datePublished: date,
    author: AUTHOR,
    url: `${BASE_URL}${path}`,
    ...(image ? { image } : {}),
    ...(keywords ? { keywords } : {}),
  };
}
