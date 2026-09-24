type Props = {
  compact?: boolean;
  inverted?: boolean;
};

export function Logo({ compact = false, inverted = false }: Props) {
  return (
    <a href="#top" className={`brand ${inverted ? "brand--inverted" : ""}`}>
      <img
        src="/images/logo.png"
        alt="Lirrey Dvora"
        width={42}
        height={39}
        className="brand__mark"
      />
      <span className="brand__text">
        <span className="brand__name" dir="ltr" aria-hidden="true">
          Lirrey Dvora
        </span>
        {compact ? null : (
          <span className="brand__tagline">לירי דבורה • מערכות חכמות לצמיחה בעסקי <span dir="ltr">Wellness</span></span>
        )}
      </span>
    </a>
  );
}
