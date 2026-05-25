export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[color:var(--line)] py-10">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-3 px-4 text-sm text-[color:var(--faint)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} DodoMiles · Yury Kirillov</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <a className="hover:text-[color:var(--ink)]" href="mailto:yury@kirillov.nl">
            yury@kirillov.nl
          </a>
          <a className="hover:text-[color:var(--ink)]" href="https://wa.me/31612234441">
            WhatsApp
          </a>
          <a className="hover:text-[color:var(--ink)]" href="https://t.me/blackemcee">
            Telegram
          </a>
        </p>
      </div>
    </footer>
  );
}
