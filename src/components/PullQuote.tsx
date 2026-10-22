type Props = {
  text: string;
  textClassName?: string;
};

export function PullQuote({ text, textClassName = "" }: Props) {
  return (
    <blockquote className="pull-quote">
      <span className="pull-quote__mark" aria-hidden="true">
        „
      </span>
      <p className={`statement__text pull-quote__text ${textClassName}`.trim()}>{text}</p>
      <span className="pull-quote__mark pull-quote__mark--end" aria-hidden="true">
        ”
      </span>
    </blockquote>
  );
}
