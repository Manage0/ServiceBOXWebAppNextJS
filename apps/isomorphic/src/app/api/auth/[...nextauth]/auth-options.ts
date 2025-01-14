import { type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pagesOptions } from './pages-options';
import { executeQuery } from '@/db';

declare module 'next-auth' {
  interface User {
    role_id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // debug: true,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('User in JWT:', user);
      if (user) {
        // Set token.user if a user object is provided
        token.user = {
          id: user.id,
          email: user.email,
          role_id: user.role_id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session:', session);
      console.log('Token:', token);

      // Ensure session.user includes user details from token.user
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user, // Merge token.user properties
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // const parsedUrl = new URL(url, baseUrl);
      // if (parsedUrl.searchParams.has('callbackUrl')) {
      //   return `${baseUrl}${parsedUrl.searchParams.get('callbackUrl')}`;
      // }
      // if (parsedUrl.origin === baseUrl) {
      //   return url;
      // }
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        try {
          const res = await executeQuery(
            'SELECT id, role_id, email FROM users WHERE email = $1',
            [credentials?.email]
          );

          if (res.rows.length > 0) {
            const user = res.rows[0];
            console.log('DB User:', user);

            return {
              id: user.id,
              email: user.email,
              role_id: user.role_id,
            };
          }
        } catch (error) {
          console.error('Error during authorization:', error);
        }

        return null;
      },
    }),
  ],
};

//userID kinyerése
/*import NextAuth from 'next-auth';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';

export default NextAuth({
  providers: [
    AzureADB2CProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // A felhasználói adatok AD-ből történő kinyerése
      if (account) {
        token.userID = profile.sub || account.id; // AD userID mentése
      }
      return token;
    },
    async session({ session, token }) {
      // Session kiegészítése a userID-val
      session.user.userID = token.userID;
      return session;
    },
  },
});*/

//Amikor a felhasználó bejelentkezik, az Active Directory azonosítóját, nevét és más adatait elmentheted az adatbázisba egy API endpoint segítségével.
/*
import { getSession } from 'next-auth/react';
import { db } from '@/lib/db'; // PostgreSQL adatbázis kapcsolódás

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).send('Unauthorized');

  const { userID, email, name } = session.user;

  const [forename, surname] = name.split(' ');

  await db.query(
    `INSERT INTO users (userID, email, forename, surname, lastLogin) 
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (userID) 
     DO UPDATE SET lastLogin = now()`,
    [userID, email, forename, surname]
  );

  res.status(200).send('User updated');
}
 */
