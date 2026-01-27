import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "youremail@example.com" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                // 1. Check for Static Admin
                if (
                    adminEmail && adminPassword &&
                    credentials.email === adminEmail &&
                    credentials.password === adminPassword
                ) {
                    return { id: "admin", name: "Admin", email: adminEmail, role: "ADMIN" };
                }

                // 2. Check Database for regular users
                try {
                    const { connectDB } = await import("@/lib/db");
                    const User = (await import("@/lib/db/models/user")).default;
                    const bcrypt = (await import("bcryptjs")).default;

                    await connectDB();

                    const user = await User.findOne({ email: credentials.email });

                    if (!user || !user.password) {
                        return null;
                    }

                    const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordMatch) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    const { logger } = await import("@/lib/utils/logger");
                    logger.apiError("CredentialsAuthorize", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    const { connectDB } = await import("@/lib/db");
                    const User = (await import("@/lib/db/models/user")).default;
                    await connectDB();

                    const existingUser = await User.findOne({ email: user.email });
                    if (!existingUser) {
                        await User.create({
                            email: user.email,
                            image: user.image,
                            googleId: profile?.sub || user.id,
                            role: "USER"
                        });
                    }
                    return true;
                } catch (error) {
                    const { logger } = await import("@/lib/utils/logger");
                    logger.apiError("GoogleSignInCallback", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role || "USER";
            }
            if (account?.provider === "google" && token.email) {
                try {
                    const { connectDB } = await import("@/lib/db");
                    const User = (await import("@/lib/db/models/user")).default;
                    await connectDB();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = dbUser.role;
                    }
                } catch (error) {
                    const { logger } = await import("@/lib/utils/logger");
                    logger.apiError("JWTCallback_Google", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};
