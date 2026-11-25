import data from "./data/automations.json";

// האוטומציות שהשאלון יכול להציע. אוטומציה שיש TODO בשם או בתיאור שלה לא תוצג באתר.

export type Automation = {
  id: string;
  stage: string;
  name: string;
  description: string;
  // הערות פנימיות מהאפיון. לא מוצגות באתר.
  howItWorks?: string;
  measure?: string;
};

export const automations: Automation[] = data.automations;
