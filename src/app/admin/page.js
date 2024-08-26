// src/app/admin/page.js
"use client"
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, imageUrl, content, author }),
        });

        const result = await response.json();

        if (response.ok) {
            setMessage('Noticia creada exitosamente');
            setTitle('');
            setImageUrl('');
            setContent('');
            setAuthor('');
        } else {
            setMessage(`Error: ${result.error}`);
        }
    };

    if (status === 'loading') {
        return <p>Cargando...</p>;
    }

    if (!session) {
        return (
            <div>
                <p>Debes iniciar sesión para acceder a esta página.</p>
                <button onClick={() => signIn()}>Iniciar Sesión</button>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => signOut()}>Cerrar Sesión</button>
            <h1>Panel de Administración</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>URL de la Imagen</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contenido</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Autor</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Crear Noticia</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}