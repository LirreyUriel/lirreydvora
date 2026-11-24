import { whatsappUrl } from "@/config";
import { about, aboutPage } from "@/content/site";
import {
  articleModified,
  articlePath,
  articles,
  articlesPage,
  author,
  wordCount,
  type Article,
} from "@/content/articles";

const SITE = "https://lirrey.com";

export type Route =
  | { kind: "home" }
  | { kind: "articles" }
  | { kind: "about" }
  | { kind: "article"; article: Article };

export type RouteMeta = {
  title: string;
  description: string;
  path: string;
  image: string;
  // og:image:alt. בלי ערך, משתמשים בכותרת העמוד.
  imageAlt?: string;
  type: "website" | "article" | "profile";
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
  if (current === aboutPage.path) return { kind: "about" };
  const article = articles.find((item) => articlePath(item) === current);
  return article ? { kind: "article", article } : { kind: "home" };
}

// דפים שמרונדרים מראש ב-build. העמוד הראשי משתמש ב-meta שכבר נמצאים ב-index.html.
export function prerenderPaths() {
  return [aboutPage.path, articlesPage.path, ...articles.map(articlePath)];
}

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// sitemap.xml נבנה מרשימת המאמרים בכל build, כך שמאמר חדש נכנס אליו לבד.
// homeModified מגיע מ-dateModified של עמוד הבית ב-index.html.
export function sitemap(homeModified: string) {
  const latest = articles.map(articleModified).sort().at(-1) ?? homeModified;
  const entries = [
    { path: "/", lastmod: homeModified, changefreq: "monthly", priority: "1.0", images: ["/og.png", "/images/about.jpg"] },
    { path: aboutPage.path, lastmod: homeModified, changefreq: "monthly", priority: "0.8", images: [about.image] },
    { path: articlesPage.path, lastmod: latest, changefreq: "weekly", priority: "0.7", images: [] },
    ...articles.map((article) => ({
      path: articlePath(article),
      lastmod: articleModified(article),
      changefreq: "yearly",
      priority: "0.6",
      images: [article.cover.og],
    })),
  ];
  const urls = entries.map((entry) =>
    [
      "  <url>",
      `    <loc>${escapeXml(SITE + entry.path)}</loc>`,
      `    <lastmod>${entry.lastmod}</lastmod>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      ...entry.images.map((image) => `    <image:image>\n      <image:loc>${escapeXml(SITE + image)}</image:loc>\n    </image:image>`),
      "  </url>",
    ].join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
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

  if (route.kind === "about") {
    const url = `${SITE}${aboutPage.path}`;
    return {
      title: aboutPage.seoTitle,
      description: aboutPage.description,
      path: aboutPage.path,
      image: about.image,
      imageAlt: about.imageAlt,
      type: "profile",
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfilePage",
            "@id": `${url}#webpage`,
            url,
            name: aboutPage.seoTitle,
            description: aboutPage.description,
            inLanguage: "he-IL",
            isPartOf: { "@id": `${SITE}/#website` },
            mainEntity: { "@id": `${SITE}/#lirrey` },
            primaryImageOfPage: `${SITE}${about.image}`,
          },
          {
            "@type": "Person",
            "@id": `${SITE}/#lirrey`,
            name: author.name,
            alternateName: "Lirrey Dvora",
            jobTitle: "מומחית אוטומציות לעסקי Wellness",
            description: about.paragraphs[0],
            image: `${SITE}${about.image}`,
            url,
            worksFor: { "@id": `${SITE}/#business` },
            knowsLanguage: ["he", "en"],
            hasCredential: {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "degree",
              name: "תואר שני במנהל עסקים (בהצטיינות)",
            },
            knowsAbout: ["אוטומציה עסקית", "אוטומציות וואטסאפ", "ניהול לידים ו-CRM", "Make", "Airtable", "עסקי Wellness"],
          },
          {
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: articlesPage.home, item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: aboutPage.title, item: url },
            ],
          },
        ],
      },
    };
  }

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
    imageAlt: article.cover.alt,
    type: "article",
    keywords: article.keywords,
    article: {
      published: article.date,
      modified: articleModified(article),
      section: articlesPage.title,
      tags: article.tags,
    },
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
          dateModified: articleModified(article),
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
            url: `${SITE}${author.url}`,
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
