import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth, signOut } from "@/lib/auth";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Your account",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/account");
  }
  const { user } = session;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-4 pt-16 pb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
            Your account
          </h1>
          <p className="mt-3 text-[color:var(--muted)]">
            Signed in via Google.
          </p>

          <div className="mt-8 flex items-center gap-5 rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-[color:var(--card)] p-6 shadow-[var(--shadow-brand)]">
            {user.image ? (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={user.image}
                  alt={user.name ?? "Profile"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-2xl font-semibold text-white">
                {(user.name ?? user.email ?? "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-medium text-[color:var(--ink)]">
                {user.name ?? "Unnamed user"}
              </p>
              <p className="truncate text-sm text-[color:var(--faint)]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-[color:var(--ink)]">
              Your bookings
            </h2>
            <div className="mt-4 rounded-[var(--radius-brand)] border border-dashed border-[color:var(--line)] bg-[color:var(--card)] p-8 text-center text-[color:var(--muted)]">
              No bookings yet. The booking flow goes live with the next batch
              of updates.
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-10"
          >
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--line)] bg-white px-5 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--ink)]"
            >
              Sign out
            </button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
