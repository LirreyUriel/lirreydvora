import data from "./data/articles.json";

export type ArticleFigure = { src: string; alt: string; width: number; height: number };

// פסקה רגילה, פסקה שנפתחת בכותרת קצרה מודגשת, או תמונה/GIF בין הפסקאות.
export type ArticleParagraph = string | { lead: string; text: string } | { figure: ArticleFigure };

export type ArticleSection = {
  heading?: string;
  paragraphs: ArticleParagraph[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  // תאריך עדכון אחרון, כשהמאמר שונה אחרי הפרסום. משמש ל-dateModified ול-lastmod ב-sitemap.
  updated?: string;
  tags: string[];
  // SEO ו-GEO: כותרת לתוצאות החיפוש, ביטויי חיפוש, תקציר "בקצרה" בראש המאמר ושאלות נפוצות בסופו.
  // התקציר והשאלות מוצגים בעמוד, כדי שגוגל ומנועי AI יוכלו לצטט תשובה ישירה.
  seoTitle: string;
  keywords: string[];
  summary: string[];
  faq: { q: string; a: string }[];
  // animated: GIF שמוצג בראש המאמר במקום הכריכה הסטטית (הכריכה נשארת לכרטיסים ולשיתוף).
  // hideOnPage: הכריכה לא מוצגת בראש המאמר, כשאותה תמונה כבר מופיעה בגוף המאמר.
  cover: {
    src: string;
    small: string;
    og: string;
    alt: string;
    animated?: ArticleFigure;
    hideOnPage?: boolean;
  };
  video?: { src: string; poster: string; label: string };
  sections: ArticleSection[];
};

// התוכן נערך דרך ממשק הניהול (npm run dev ואז /admin/) ונשמר ב-data/articles.json.
export const author = data.author;
export const articlesPage = data.articlesPage;
export const articleCta = data.articleCta;
export const projectsTeaser = data.projectsTeaser;
export const articles = data.articles as Article[];

export function articleModified(article: Article) {
  return article.updated ?? article.date;
}

export function articlePath(article: Article) {
  return `${articlesPage.path}${article.slug}/`;
}

// גוף המאמר כטקסט רצוף, בלי תמונות.
export function articleText(article: Article) {
  return article.sections
    .flatMap((section) => section.paragraphs)
    .map((p) => (typeof p === "string" ? p : "lead" in p ? `${p.lead} ${p.text}` : ""))
    .filter(Boolean)
    .join(" ");
}

export function wordCount(article: Article) {
  return articleText(article).split(/\s+/).length;
}

// כ-200 מילים לדקה, מעוגל למעלה.
export function readTime(article: Article) {
  const minutes = Math.max(1, Math.ceil(wordCount(article) / 200));
  return `${minutes} דקות קריאה`;
}

// שני מאמרים נוספים לקישור פנימי בסוף כל מאמר: קודם כאלה שחולקים תגית, ואז לפי הסדר.
export function relatedArticles(article: Article, count = 2) {
  const others = articles.filter((item) => item.slug !== article.slug);
  const shared = (item: Article) => item.tags.some((tag) => article.tags.includes(tag));
  return [...others.filter(shared), ...others.filter((item) => !shared(item))].slice(0, count);
}
