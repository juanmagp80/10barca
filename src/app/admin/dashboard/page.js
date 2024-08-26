"use client";
import { useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

export default function AddNews() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.from('news').insert([
            { title, content, editor_name: 'Redactor Ejemplo' },
        ]);

        if (error) {
            setError(error.message);
        } else {
            setTitle('');
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Contenido"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button type="submit">Agregar Noticia</button>
            {error && <p>{error}</p>}
        </form>
    );
}
