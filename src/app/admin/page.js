'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

function AdminPage() {
    const [user, setUser] = useState(null);
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    throw error;
                }
                setUser(data.user);
                console.log("Usuario obtenido:", data.user);
            } catch (error) {
                console.error('Error obteniendo usuario:', error.message);
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchNews = async () => {
            const { data, error } = await supabase
                .from('news')
                .select('*');

            if (error) {
                console.error('Error fetching news:', error.message);
            } else {
                setNews(data);
                console.log("Noticias obtenidas:", data);
            }
        };

        getUser();
        fetchNews();
    }, [router]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error);
        router.push('/admin/login');
    };

    const openModal = (newsItem = null) => {
        setCurrentNews(newsItem);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentNews(null);
        setIsModalOpen(false);
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
        return <p>Cargando...</p>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                    Crear Nueva Noticia
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-700 transition duration-200"
                >
                    Logout
                </button>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-lg">
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
                                        onClick={() => openModal(newsItem)}
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

            {isModalOpen && (
                <CreateOrEditNewsModal
                    onClose={closeModal}
                    newsItem={currentNews}
                    onNewsSaved={(newNews) => {
                        if (currentNews) {
                            setNews(news.map(n => n.id === newNews.id ? newNews : n));
                        } else {
                            setNews([...news, newNews]);
                        }
                        closeModal();
                    }}
                />
            )}

            {confirmDelete && (
                <DeleteConfirmationModal
                    onClose={() => setConfirmDelete(null)}
                    onConfirm={() => handleDelete(confirmDelete)}
                />
            )}
        </div>
    );
}

function CreateOrEditNewsModal({ onClose, newsItem, onNewsSaved }) {
    const [title, setTitle] = useState(newsItem?.title || '');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(newsItem?.image_url || '');
    const [content, setContent] = useState(newsItem?.content || '');
    const [author, setAuthor] = useState(newsItem?.author || '');
    const [createdAt, setCreatedAt] = useState(newsItem ? new Date(newsItem.created_at).toISOString().split('T')[0] : '');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Prevenir scroll en la página detrás del modal
        document.body.style.overflow = 'hidden';
        return () => {
            // Restaurar scroll cuando se cierre el modal
            document.body.style.overflow = 'auto';
        };
    }, []);
    const handleSaveNews = async (e) => {
        e.preventDefault();
        let imageUrl = imagePreview;

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

        let result;
        if (newsItem) {
            result = await supabase
                .from('news')
                .update({ title, image_url: imageUrl, content, author, created_at: createdAt })
                .eq('id', newsItem.id);
        } else {
            result = await supabase
                .from('news')
                .insert([{ title, image_url: imageUrl, content, author, created_at: createdAt }]);
        }

        const { error, data } = result;

        if (error) {
            console.error('Error al guardar la noticia:', error.message);
            setMessage('Error al guardar la noticia');
        } else if (data && data.length > 0) {
            setMessage('Noticia guardada exitosamente');
            onNewsSaved(data[0]);
        } else {
            console.error('Error: no se pudo obtener la noticia guardada.');
            setMessage('Error: no se pudo obtener la noticia guardada.');
        }
    };


    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(imageFile);
        }
    }, [imageFile]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl h-[90vh] overflow-y-auto">
                <h1 className="text-2xl font-semibold text-center mb-4">{newsItem ? 'Editar Noticia' : 'Crear Noticia'}</h1>
                <form onSubmit={handleSaveNews} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                            type="text"
                            placeholder="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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
                            className="h-40 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                            <input
                                type="text"
                                placeholder="Autor"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                            <input
                                type="date"
                                value={createdAt}
                                onChange={(e) => setCreatedAt(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        {newsItem ? 'Guardar Cambios' : 'Crear'}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-500">{message}</p>}
                <button
                    onClick={onClose}
                    className="mt-4 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                >
                    Cancelar
                </button>
            </div>
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
