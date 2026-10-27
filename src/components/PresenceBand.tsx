import { statement } from "@/content/site";

// משפט על הנוכחות מול הלקוחות, עם תמונה מהסטודיו.
export function PresenceBand() {
  return (
    <section className="opening-band" id={statement.id}>
      <div className="container opening-band__layout">
        <blockquote className="opening-band__quote">
          <p className="quote-type">{statement.text}</p>
        </blockquote>
        <img
          className="opening-band__photo"
          src="/images/presence.jpg"
          width={1024}
          height={682}
          alt="שיחת ייעוץ בסטודיו, כשהמשימות כבר מסודרות על המסך"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
