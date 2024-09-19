import { authOptions } from "@/lib/auth";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    token?: string | null;
    id?: string;
    // Add other properties you might need
  }

  interface Session {
    user: {
      token?: string | null;
      id?: string;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, handler };
