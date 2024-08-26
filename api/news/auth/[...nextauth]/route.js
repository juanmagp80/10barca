// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            // Configura tu proveedor de autenticación aquí
        }),
    ],
    // Configura otras opciones de NextAuth aquí
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
