import axios from "axios";
import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface CustomUser {
  token: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<CustomUser | null> => {
        try {
          const response = await axios.post(
            "http://94.74.86.174:8080/api/login",
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          );

          const { token } = response.data.data;

          return { token }; // Return user object with token
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; // Return null if authorization fails
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.token = token.token as string; // Add token to session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.token = (user as CustomUser).token; // Add token to JWT
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth",
  },
};

export const getAuthSession = () => getServerSession(authOptions);
