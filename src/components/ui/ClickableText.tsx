export function ClickableText({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}
