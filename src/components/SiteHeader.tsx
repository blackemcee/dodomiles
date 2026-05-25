import Image from "next/image";
import Link from "next/link";

type Props = {
  navItems?: { href: string; label: string }[];
};

export function SiteHeader({ navItems }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--line)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(251,252,247,0.76)]">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="DodoMiles home">
          <Image
            src="/pics/logo.svg"
            alt="DodoMiles"
            width={128}
            height={28}
            priority
          />
        </Link>
        {navItems && navItems.length > 0 && (
          <nav
            aria-label="Page sections"
            className="hidden gap-5 text-sm text-[color:var(--muted)] md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[color:var(--accent)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
