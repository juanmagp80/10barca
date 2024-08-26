// app/auth/register/page.js
'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) console.error('Error al registrarse:', error.message);
        else window.location.href = '/auth/login';
    };

    return (
        <div>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Registrarse</button>
        </div>
    );
}
