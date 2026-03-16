export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  return (
    <footer className="bg-foreground text-primary-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p className="opacity-80">
          © {year} Kwarcab Subang. Dibangun dengan{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-100 opacity-80"
          >
            Caffeine
          </a>
        </p>
      </div>
    </footer>
  );
}
