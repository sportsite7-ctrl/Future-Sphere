type NewsImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1800&q=90";

function getEditorialImageUrl(src?: string | null) {
  const value = src?.trim();
  if (!value) return fallbackImage;

  // Ask Unsplash for a large editorial rendition instead of inheriting
  // small RSS thumbnail parameters. Other providers keep their original URL.
  if (value.startsWith("https://images.unsplash.com/")) {
    try {
      const url = new URL(value);
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", "1800");
      url.searchParams.set("q", "90");
      return url.toString();
    } catch {
      return value;
    }
  }

  return value;
}

export function NewsImage({
  src,
  alt,
  className = "",
  priority = false,
}: NewsImageProps) {
  return (
    <img
      src={getEditorialImageUrl(src)}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
