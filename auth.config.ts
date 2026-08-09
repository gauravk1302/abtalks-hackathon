import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    GitHub,
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!(profile?.email_verified)
      }
      return true
    },
    async jwt({ token, user }) {
      // Sign-in ke waqt user object aata hai, uska id token mein daal do
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Token se id nikalke session.user mein daal do
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig