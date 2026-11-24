// מודיע ל-Bing (ולמנועים נוספים שתומכים ב-IndexNow) על כל הכתובות שב-sitemap החי.
// להריץ אחרי שה-deploy ב-Vercel הסתיים: npm run indexnow
// החיפוש של ChatGPT נשען על האינדקס של Bing, אז זה מקצר את הזמן עד שדף חדש מופיע שם.
const SITE = "https://lirrey.com";
const KEY = "d80f9c9ac8ec9ecf8cd0e4f9bf8002f4"; // הקובץ public/d80f9c9ac8ec9ecf8cd0e4f9bf8002f4.txt מאמת את המפתח, ומותר שיהיה ציבורי.

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urlList.length) throw new Error("indexnow: no URLs found in sitemap.xml");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "lirrey.com", key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});

console.log(`indexnow: sent ${urlList.length} URLs, status ${response.status}`);
if (!response.ok && response.status !== 202) process.exit(1);
