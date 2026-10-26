import { articlePath, articles, articlesPage, author, type Article } from "@/content/articles";

const SITE = "https://lirreydvora.com";

export type Route =
  | { kind: "home" }
  | { kind: "articles" }
  | { kind: "article"; article: Article };

export type RouteMeta = {
  title: string;
  description: string;
  path: string;
  image: string;
  type: "website" | "article";
  jsonLd?: object;
};

function normalize(path: string) {
  return path.endsWith("/") ? path : `${path}/`;
}

export function resolveRoute(path: string): Route {
  const current = normalize(path);
  if (current === articlesPage.path) return { kind: "articles" };
  const article = articles.find((item) => articlePath(item) === current);
  return article ? { kind: "article", article } : { kind: "home" };
}

// דפים שמרונדרים מראש ב-build. העמוד הראשי משתמש ב-meta שכבר נמצאים ב-index.html.
export function prerenderPaths() {
  return [articlesPage.path, ...articles.map(articlePath)];
}

export function routeMeta(route: Route): RouteMeta | null {
  if (route.kind === "home") return null;

  if (route.kind === "articles") {
    return {
      title: `${articlesPage.title} | לירי דבורה`,
      description: articlesPage.intro,
      path: articlesPage.path,
      image: "/og.png",
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${SITE}${articlesPage.path}#blog`,
        url: `${SITE}${articlesPage.path}`,
        name: `${articlesPage.title} | לירי דבורה`,
        description: articlesPage.intro,
        inLanguage: "he-IL",
        publisher: { "@id": `${SITE}/#business` },
        blogPost: articles.map((article) => ({
          "@type": "BlogPosting",
          headline: article.title,
          url: `${SITE}${articlePath(article)}`,
          datePublished: article.date,
        })),
      },
    };
  }

  const { article } = route;
  return {
    title: `${article.title} | לירי דבורה`,
    description: article.description,
    path: articlePath(article),
    image: article.cover.og,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${SITE}${articlePath(article)}#article`,
      mainEntityOfPage: `${SITE}${articlePath(article)}`,
      headline: article.title,
      description: article.description,
      image: `${SITE}${article.cover.og}`,
      datePublished: article.date,
      dateModified: article.date,
      inLanguage: "he-IL",
      keywords: article.tags.join(", "),
      author: { "@type": "Person", "@id": `${SITE}/#lirrey`, name: author.name, url: `${SITE}/#about` },
      publisher: { "@id": `${SITE}/#business` },
      isPartOf: { "@id": `${SITE}${articlesPage.path}#blog` },
      ...(article.video
        ? {
            video: {
              "@type": "VideoObject",
              name: article.video.label,
              description: article.description,
              contentUrl: `${SITE}${article.video.src}`,
              thumbnailUrl: `${SITE}${article.cover.og}`,
              uploadDate: article.date,
            },
          }
        : {}),
    },
  };
}
