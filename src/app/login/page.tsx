import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth, signIn } from "@/lib/auth";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();
  const { next } = await searchParams;
  const redirectTo = next?.startsWith("/") ? next : "/account";

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
            Sign in to DodoMiles
          </h1>
          <p className="mt-3 text-[color:var(--muted)]">
            One click, no password. We use your Google account to identify
            you and let you manage your bookings.
          </p>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo });
            }}
            className="mt-8 w-full"
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-base font-medium text-[color:var(--ink)] shadow-sm transition-colors hover:border-[color:var(--ink)] hover:bg-[color:var(--bg0)]"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-xs text-[color:var(--faint)]">
            By continuing you agree we&apos;ll store your name and email so we
            can contact you about your trip.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.98 21.98 0 0 0 2 24c0 3.55.85 6.9 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}
