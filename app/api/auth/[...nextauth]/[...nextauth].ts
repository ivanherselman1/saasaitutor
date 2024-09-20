import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

console.log('NextAuth configuration file is being executed');

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        console.log('Attempting to send verification email');
        console.log('Email:', identifier);
        console.log('URL:', url);
        console.log('Provider:', JSON.stringify(provider));
        // The default sendVerificationRequest function will be called here
      },
    }),
  ],
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('Sign-in callback:', { user, account, profile, email, credentials });
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
};

console.log('NextAuth configuration completed');

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };