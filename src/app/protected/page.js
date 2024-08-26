// app/protected/page.js
'use client';
import { useUser } from '@/context/UserContext';

export default function ProtectedPage() {
    const { user } = useUser();

    if (!user) {
        return <p>Acceso denegado. Necesitas iniciar sesión.</p>;
    }

    return <div>Contenido protegido visible solo para usuarios autenticados.</div>;
}
