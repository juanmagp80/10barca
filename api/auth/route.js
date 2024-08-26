// app/api/auth/route.js

import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";

export const authOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  secret: process.env.NEXTAUTH_SECRET,
};

export default async function handler(req, res) {
  return NextAuth(req, res, authOptions);
}
