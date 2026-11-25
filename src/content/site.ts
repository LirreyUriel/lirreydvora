// התוכן נערך דרך ממשק הניהול (npm run dev ואז /admin/) ונשמר ב-data/site.json.
import data from "./data/site.json";

export const cta = data.cta;
export const hero = data.hero;
export const shift = data.shift;
export const statement = data.statement;
export const about = data.about;
export const aboutPage = data.aboutPage;
export const outcomes = data.outcomes;
export const story = data.story;
export const leadForm = data.leadForm;
export const howItWorks = data.howItWorks;
export const faq = data.faq;
export const finalCta = data.finalCta;
export const footer = data.footer;
export const privacy = data.privacy;
export const floatingWhatsApp = data.floatingWhatsApp;
export const whatsappChat = data.whatsappChat as {
  name: string;
  status: string;
  messages: { from: "customer" | "business"; text: string }[];
};
export const crmLeads = data.crmLeads;
export const contact = data.contact;
