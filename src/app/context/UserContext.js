// app/context/UserContext.js
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        // Aquí no es necesario llamar a unsubscribe
        return () => {
            // No hay que hacer nada en la limpieza, si es que no hay unsubscribe
        };
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
