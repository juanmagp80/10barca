'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

function CreateNewsModal({ onClose }) {
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleCreateNews = async (e) => {
        e.preventDefault();
        let imageUrl = '';

        if (imageFile) {
            const { data, error: uploadError } = await supabase
                .storage
                .from('images')
                .upload(`public/${imageFile.name}`, imageFile);

            if (uploadError) {
                console.error('Error al subir la imagen:', uploadError.message);
                setMessage('Error al subir la imagen');
                return;
            }

            imageUrl = data.path;
        }

        const { error: insertError } = await supabase
            .from('news')
            .insert([
                { title, image_url: imageUrl, content, author, created_at: createdAt }
            ]);

        if (insertError) {
            console.error('Error al insertar la noticia:', insertError.message);
            setMessage('Error al insertar la noticia');
            return;
        }

        setMessage('Noticia creada exitosamente');
        console.log("noticia creada", title, imageUrl, content, author, createdAt);

        // Cierra el modal automáticamente después de crear la noticia
        onClose();
    };

    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreview('');
        }
    }, [imageFile]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto">
                <h1 className="text-3xl font-semibold text-center mb-6">Crear Noticia</h1>
                <form onSubmit={handleCreateNews} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                            type="text"
                            placeholder="Títuloprueba"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                        <input
                            type="file"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm file:bg-blue-100 file:text-blue-800 file:border file:border-blue-300 file:rounded-md hover:file:bg-blue-200 w-full"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="h-60 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                        <input
                            type="text"
                            placeholder="Autor"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación</label>
                        <input
                            type="date"
                            value={createdAt}
                            onChange={(e) => setCreatedAt(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Crear
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();
    }, [router]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error);
        router.push('/admin/login');
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (typeof window === 'undefined') {
        return null; // Evita renderizar en el servidor
    }

    if (!user) {
        return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se verifica la autenticación
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-6">Panel de Administración</h1>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={openModal}
                    className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                    Crear Nueva Noticia
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-red-700 transition duration-200"
                >
                    Logout
                </button>
            </div>

            {isModalOpen && <CreateNewsModal onClose={closeModal} />}
        </div>
    );
}