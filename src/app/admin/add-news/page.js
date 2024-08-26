// src/app/admin/add-news/page.js
'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AddNewsPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleAddNews = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('news')
            .insert([{ title, content }]);

        if (error) {
            console.error('Error al añadir la noticia:', error.message);
        } else {
            alert('Noticia añadida con éxito');
            setTitle('');
            setContent('');
        }
    };

    return (
        <div>
            <h1>Añadir Noticia</h1>
            <form onSubmit={handleAddNews}>
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
                />
                <button type="submit">Añadir Noticia</button>
            </form>
        </div>
    );
}
