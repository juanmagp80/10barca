
"use client"
import { useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();
        const { user, session, error } = await supabase.auth.signInWithEmailAndPassword(email, password);
        if (error) {
            alert(error.message);
        } else {
            setUser(session?.user);
        }
    }

    return (
        <div>
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
            </form>
        </div>
    );
}