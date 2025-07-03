import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user)
        session.user.id = token.sub;

      return session;
    },
    async jwt({ token, user }) {
      if (user)
        token.id = user.id;

      return token;
    }
  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
