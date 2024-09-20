// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // Import the MongoDB adapter
import clientPromise from "../../../../lib/mongodb"; // Import your MongoDB client

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise), // Add the adapter here
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email }) {
      console.log("Sign-in callback:", { user, account, profile, email });
      return true; // Ensure this returns true to proceed with sign-in
    },
    async session({ session, token, user }) {
      console.log("Session callback:", { session, token, user });
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
