// app/admin/page.js
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function CreateNews() {
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user);
        });

        if (!user) {
            window.location.href = '/admin/login';
        }

        return () => {
            authListener.unsubscribe();
        };
    }, [user]);

    const handleCreateNews = async () => {
        let imageUrl = '';

        if (imageFile) {
            const { data, error: uploadError } = await supabase
                .storage
                .from('images')
                .upload(`public/${imageFile.name}`, imageFile);

            if (uploadError) {
                console.error('Error al subir la imagen:', uploadError.message);
                return;
            }

            imageUrl = data.path;
        }

        const { error } = await supabase
            .from('news')
            .insert([{ title, image_url: imageUrl, content, author, created_at: createdAt }]);

        if (error) {
            console.error('Error al crear la noticia:', error.message);
        } else {
            setTitle('');
            setImageFile(null);
            setContent('');
            setAuthor('');
            setCreatedAt('');
            alert('Noticia creada con éxito');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Crear Noticia</h1>
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <textarea
                placeholder="Contenido"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
                type="text"
                placeholder="Autor"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <input
                type="datetime-local"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <button
                onClick={handleCreateNews}
                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Crear Noticia
            </button>
        </div>
    );
}