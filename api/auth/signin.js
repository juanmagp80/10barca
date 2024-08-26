// pages/auth/signin.js
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password
        });

        if (result.error) {
            setError(result.error);
        } else {
            window.location.href = '/admin';
        }
    };

    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario</label>
                    <input type="text" name="username" required />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input type="password" name="password" required />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}