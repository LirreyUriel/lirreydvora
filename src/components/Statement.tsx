import { statement } from "@/content/site";

export function Statement() {
  return (
    <section className="section statement" id={statement.id}>
      <div className="container">
        <p className="statement__text">{statement.text}</p>
      </div>
    </section>
  );
}
