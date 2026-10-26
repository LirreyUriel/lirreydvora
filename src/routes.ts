import { whatsappUrl } from "@/config";
import { articlePath, articles, articlesPage, author, wordCount, type Article } from "@/content/articles";

const SITE = "https://lirrey.com";

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
  keywords?: string[];
  // תגיות article:* של Open Graph.
  article?: { published: string; modified: string; section: string; tags: string[] };
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

// llms-full.txt: כל מאמר בטקסט מלא, עם תקציר ושאלות נפוצות, כדי שמנועי AI יוכלו לצטט ולקשר.
export function llmsFull() {
  const blocks = articles.map((article) =>
    [
      `## ${article.title}`,
      `URL: ${SITE}${articlePath(article)}`,
      `נושאים: ${[...article.tags, ...article.keywords].join(", ")}`,
      "",
      `### ${articlesPage.summaryTitle}`,
      ...article.summary.map((point) => `- ${point}`),
      "",
      ...article.sections.flatMap((section) => [
        ...(section.heading ? [`### ${section.heading}`] : []),
        ...section.paragraphs.flatMap((p) =>
          typeof p === "string" ? [p] : "lead" in p ? [`${p.lead} ${p.text}`] : [],
        ),
        "",
      ]),
      `### ${articlesPage.faqTitle}`,
      ...article.faq.flatMap((item) => [`ש: ${item.q}`, `ת: ${item.a}`, ""]),
    ].join("\n"),
  );
  return [
    `# ${articlesPage.title}: ${author.name} (Lirrey Dvora), אוטומציות לעסקי Wellness`,
    "",
    `> ${articlesPage.intro} כל הפרויקטים: ${SITE}${articlesPage.path}`,
    "",
    ...blocks,
    `יצירת קשר: ${whatsappUrl} | ${SITE}/`,
    "",
  ].join("\n");
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
          description: article.description,
          url: `${SITE}${articlePath(article)}`,
          image: `${SITE}${article.cover.og}`,
          datePublished: article.date,
          author: { "@id": `${SITE}/#lirrey` },
        })),
      },
    };
  }

  const { article } = route;
  const url = `${SITE}${articlePath(article)}`;
  return {
    title: `${article.seoTitle} | לירי דבורה`,
    description: article.description,
    path: articlePath(article),
    image: article.cover.og,
    type: "article",
    keywords: article.keywords,
    article: { published: article.date, modified: article.date, section: articlesPage.title, tags: article.tags },
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          url,
          headline: article.title,
          alternativeHeadline: article.seoTitle,
          description: article.description,
          abstract: article.summary.join(" "),
          image: {
            "@type": "ImageObject",
            url: `${SITE}${article.cover.og}`,
            caption: article.cover.alt,
          },
          datePublished: article.date,
          dateModified: article.date,
          inLanguage: "he-IL",
          articleSection: articlesPage.title,
          keywords: [...article.keywords, ...article.tags].join(", "),
          about: article.tags.map((name) => ({ "@type": "Thing", name })),
          wordCount: wordCount(article),
          author: {
            "@type": "Person",
            "@id": `${SITE}/#lirrey`,
            name: author.name,
            alternateName: "Lirrey Dvora",
            url: `${SITE}/#about`,
            jobTitle: "מומחית אוטומציות לעסקי Wellness",
          },
          publisher: { "@id": `${SITE}/#business` },
          isPartOf: { "@id": `${SITE}${articlesPage.path}#blog` },
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["#post-title", ".post__summary"] },
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
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          url,
          inLanguage: "he-IL",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: articlesPage.home, item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: articlesPage.title, item: `${SITE}${articlesPage.path}` },
            { "@type": "ListItem", position: 3, name: article.title, item: url },
          ],
        },
      ],
    },
  };
}
