import { PullQuote } from "@/components/PullQuote";
import { statement } from "@/content/site";

export function Statement() {
  return (
    <section className="section statement" id={statement.id}>
      <div className="container">
        <PullQuote text={statement.text} />
      </div>
    </section>
  );
}
