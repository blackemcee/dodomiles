import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  // Augment the User passed to callbacks so `user.role` is typed.
  interface User {
    role: UserRole;
  }
}
