type Props = {
  compact?: boolean;
  inverted?: boolean;
  mobileLine?: boolean;
};

export function Logo({ compact = false, inverted = false, mobileLine = false }: Props) {
  return (
    <a href="#top" className={`brand ${inverted ? "brand--inverted" : ""}`}>
      <img
        src="/images/logo.png"
        alt=""
        width={42}
        height={39}
        className="brand__mark"
      />
      <span className="brand__text">
        <span className="brand__name">לירי דבורה</span>
        {mobileLine ? (
          <span className="brand__mobile-line">
            לירי דבורה | אוטומציות לעסקי <span dir="ltr">Wellness</span>
          </span>
        ) : null}
        {compact ? null : (
          <span className="brand__tagline">לירי דבורה • אוטומציות לעסקי <span dir="ltr">Wellness</span></span>
        )}
      </span>
    </a>
  );
}
