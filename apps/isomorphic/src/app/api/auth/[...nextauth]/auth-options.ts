import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pagesOptions } from './pages-options';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false, // Use true if you have a valid SSL certificate
  },
});

export const authOptions: NextAuthOptions = {
  pages: {
    ...pagesOptions,
  },
  session: {
    //strategy: 'database', //ez errort dob
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
        token.user = user;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials) {
          return null;
        }

        const { email, password } = credentials;

        try {
          const nonRealLogin = true;
          if (nonRealLogin) {
            return { id: '1234', email: 'asd@asd.asd' };
          }
          // Query the database for the user
          const result = await pool.query(
            'SELECT id, email, password FROM users WHERE email = $1',
            [email]
          );

          if (result.rows.length === 0) {
            return null; // User not found
          }

          const user = result.rows[0];

          // Replace this with proper password hashing (e.g., bcrypt.compare)
          if (password !== user.password) {
            return null; // Invalid password
          }

          return { id: user.id, email: user.email };
        } catch (err) {
          console.error('Error authorizing user:', err);
          return null;
        }
      },
    }),
  ],
};
