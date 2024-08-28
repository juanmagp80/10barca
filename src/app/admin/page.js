"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

function CreateNewsModal({ onClose }) {
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Crear Noticia</h1>
                <form onSubmit={handleCreateNews} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <textarea
                        placeholder="Contenido"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="p-2 border border-gray-300 rounded min-h-[100px]"
                    />
                    <input
                        type="text"
                        placeholder="Autor"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="date"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error fetching session:', error);
                return;
            }

            if (!session) {
                router.push('/admin/login');
            } else {
                console.log('Usuario autenticado:', session.user.email); // Para depuración
                if (session.user.email === 'redactor@redactor.com') {
                    setUser(session.user);
                } else {
                    router.push('/');
                }
            }
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

    if (!user) {
        return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se verifica la autenticación
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
            <button
                onClick={openModal}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            >
                Crear Nueva Noticia
            </button>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md ml-4"
            >
                Logout
            </button>

            {isModalOpen && <CreateNewsModal onClose={closeModal} />}
        </div>
    );
}

