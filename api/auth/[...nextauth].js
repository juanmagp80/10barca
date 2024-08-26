// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                // Aquí debes implementar la lógica para verificar las credenciales del usuario
                // Por ejemplo, puedes verificar contra una base de datos
                const user = { id: 1, name: 'Admin', email: 'admin@example.com' };

                if (credentials.username === 'admin' && credentials.password === 'admin') {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error', // Redirigir a esta página en caso de error
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    }
});