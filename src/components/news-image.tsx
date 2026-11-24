type NewsImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=90";

export function NewsImage({
  src,
  alt,
  className = "",
  priority = false,
}: NewsImageProps) {
  const imageSrc = src?.trim() || fallbackImage;

  return (
    // Native img intentionally preserves the source's original resolution and
    // avoids Next.js remote-host restrictions for editorial image providers.
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
