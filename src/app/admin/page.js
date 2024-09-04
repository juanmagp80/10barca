'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient'; // Ajusta la ruta si es necesario

function AdminPage() {
    const [user, setUser] = useState(null);
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [form, setForm] = useState({
        title: '',
        imageFile: null,
        imagePreview: '',
        content: '',
        author: '',
        createdAt: ''
    });
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(data.user);
            } catch (error) {
                console.error('Error obteniendo usuario:', error.message);
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchNews = async () => {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*');

                if (error) throw error;
                setNews(data);
            } catch (error) {
                console.error('Error fetching news:', error.message);
            }
        };

        getUser();
        fetchNews();
    }, [router]);


    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        }
        router.push('/'); // Redirige a la página de inicio
    };


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setForm({
            ...form,
            [name]: type === 'file' ? files[0] : value
        });
        if (name === 'imageFile' && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setForm({ ...form, imagePreview: reader.result });
            reader.readAsDataURL(files[0]);
        }
    };

    const handleSaveNews = async (e) => {
        e.preventDefault();
        const { title, imageFile, imagePreview, content, author, createdAt } = form;
        let imageUrl = imagePreview;

        if (imageFile) {
            try {
                const { data, error: uploadError } = await supabase
                    .storage
                    .from('images')
                    .upload(`public/${imageFile.name}`, imageFile);

                if (uploadError) throw uploadError;

                imageUrl = data.path; // Obtén la URL de la imagen
            } catch (error) {
                console.error('Error al subir la imagen:', error.message);
                setMessage('Error al subir la imagen');
                return;
            }
        }

        let result;
        try {
            if (currentNews) {
                // Actualizar noticia existente
                result = await supabase
                    .from('news')
                    .update({ title, image_url: imageUrl, content, author, created_at: createdAt })
                    .eq('id', currentNews.id);
            } else {
                // Insertar nueva noticia
                result = await supabase
                    .from('news')
                    .insert([{ title, image_url: imageUrl, content, author, created_at: createdAt }]);
            }

            // Log de la respuesta para depuración
            console.log('Resultado de la operación de Supabase:', result);

            if (result.error) throw result.error;

            // Asegúrate de que la respuesta contiene datos
            if (result.data && result.data.length > 0) {
                setMessage('Noticia guardada exitosamente');
                setNews(currentNews ? news.map(n => n.id === result.data[0].id ? result.data[0] : n) : [...news, result.data[0]]);
                setForm({
                    title: '',
                    imageFile: null,
                    imagePreview: '',
                    content: '',
                    author: '',
                    createdAt: ''
                });
                setCurrentNews(null);
                setIsModalOpen(false);
            } else {
                throw new Error('No se recibieron datos al guardar la noticia.');
            }
        } catch (error) {
            console.error('Error al guardar la noticia:', error.message);
            setMessage(`Error al guardar la noticia: ${error.message}`);
        }
    };


    const handleDelete = async (newsId) => {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', newsId);

        if (error) {
            console.error('Error deleting news:', error.message);
        } else {
            setNews(news.filter(news => news.id !== newsId));
            setConfirmDelete(null);
        }
    };

    if (isLoading) {
        return <p className="text-center">Cargando...</p>;
    }

    if (!user) {
        return <p className="text-center">Acceso denegado. Redirigiendo a la página de inicio de sesión...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
            <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200 mb-4"
            >
                Volver al Inicio
            </button>
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-700 transition duration-200 mb-4"
            >
                Salir
            </button>


            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mb-4">
                <h2 className="text-xl font-semibold mb-3">Crear Noticia</h2>
                <form onSubmit={handleSaveNews} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Título"
                            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                        <input
                            type="file"
                            name="imageFile"
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm file:bg-blue-100 file:text-blue-800 file:border file:border-blue-300 file:rounded-md hover:file:bg-blue-200 w-full"
                        />
                        {form.imagePreview && (
                            <div className="mt-4">
                                <img src={form.imagePreview} alt="Preview" className="w-full h-auto rounded-md" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            className="h-40 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                            <input
                                type="text"
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                placeholder="Autor"
                                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                            <input
                                type="date"
                                name="createdAt"
                                value={form.createdAt}
                                onChange={handleChange}
                                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Guardar Noticia
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-3">Listado de Noticias</h2>
                {news.length === 0 ? (
                    <p>No hay noticias disponibles.</p>
                ) : (
                    <ul className="space-y-3">
                        {news.map((newsItem) => (
                            <li key={newsItem.id} className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold">{newsItem.title}</h3>
                                    <p>{newsItem.author} - {new Date(newsItem.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setForm({
                                                title: newsItem.title,
                                                imageFile: null,
                                                imagePreview: newsItem.image_url,
                                                content: newsItem.content,
                                                author: newsItem.author,
                                                createdAt: newsItem.created_at.split('T')[0]
                                            });
                                            setCurrentNews(newsItem);
                                            setIsModalOpen(true);
                                        }}
                                        className="bg-yellow-500 text-white py-1 px-3 rounded-lg hover:bg-yellow-600 transition duration-200"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(newsItem.id)}
                                        className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition duration-200"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {confirmDelete && (
                <DeleteConfirmationModal
                    onClose={() => setConfirmDelete(null)}
                    onConfirm={() => handleDelete(confirmDelete)}
                />
            )}
        </div>
    );
}

function DeleteConfirmationModal({ onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
                <p>¿Estás seguro de que deseas eliminar esta noticia?</p>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
