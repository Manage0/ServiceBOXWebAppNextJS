import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '@/env.mjs';
import isEqual from 'lodash/isEqual';
import { pagesOptions } from './pages-options';
import { Client } from 'pg';
import { executeQuery } from '@/db';

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
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.idToken as string,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        // return user as JWT
        token.user = user;
      }
      return token;
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
        const user = {
          id: '12345', // Add the id property here
          email: 'john.doe@example.com',
          password: 'admin',
        };

        try {
          const res = await executeQuery(
            'SELECT id, "roleID" FROM users WHERE email = $1',
            [credentials?.email]
          );

          if (res.rows.length > 0) {
            const user = res.rows[0]; // Contains id and roleID
            console.log('USER: ', user);
          }

          if (
            isEqual(user, {
              id: '12345',
              email: credentials?.email,
              password: credentials?.password,
            })
          ) {
            console.log('returning user');
            return user;
          }
        } catch (error) {
          console.error('Error:', error);
          return null;
        }
        console.log('returning null');
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
