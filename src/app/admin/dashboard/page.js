// src/app/admin/dashboard/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const session = supabase.auth.getSession();
        if (!session.data?.session) {
            router.push('/admin/login');
        } else {
            setUser(session.data.session.user);
        }
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return user ? (
        <div>
            <h1>Panel de Administración</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    ) : (
        <p>Cargando...</p>
    );
}
