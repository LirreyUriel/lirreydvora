import type { CSSProperties } from "react";

type Props = {
  text: string;
  id?: string;
  className?: string;
};

export function WordReveal({ text, id, className }: Props) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <h2 id={id} className={className ? `words ${className}` : "words"}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="word" style={{ "--i": index } as CSSProperties}>
          {word}
        </span>
      ))}
    </h2>
  );
}
