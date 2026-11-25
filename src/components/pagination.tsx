import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  locale,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  locale: "uk" | "en";
}) {
  if (totalPages <= 1) return null;
  const href = (value: number) => value === 1 ? basePath : `${basePath}?page=${value}`;
  const previous = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;
  return (
    <nav className="pagination" aria-label={locale === "en" ? "Pagination" : "Навігація сторінками"}>
      {previous ? <Link className="pagination-arrow" href={href(previous)}>{locale === "en" ? "← Previous" : "← Назад"}</Link> : <span className="pagination-arrow is-disabled">{locale === "en" ? "← Previous" : "← Назад"}</span>}
      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
          <Link key={value} href={href(value)} className={value === page ? "pagination-page is-active" : "pagination-page"} aria-current={value === page ? "page" : undefined}>{value}</Link>
        ))}
      </div>
      {next ? <Link className="pagination-arrow" href={href(next)}>{locale === "en" ? "Next →" : "Далі →"}</Link> : <span className="pagination-arrow is-disabled">{locale === "en" ? "Next →" : "Далі →"}</span>}
    </nav>
  );
}
