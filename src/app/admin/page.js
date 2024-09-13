"use client"
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
        createdAt: '',
        category: '' // Añadir categoría al formulario
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
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === 'file' ? files[0] : value
        }));
        if (name === 'imageFile' && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setForm((prevForm) => ({ ...prevForm, imagePreview: reader.result }));
            reader.readAsDataURL(files[0]);
        }
    };

    const handleSaveNews = async (e) => {
        e.preventDefault();
        try {
            const { title, imageFile, content, author, createdAt, category } = form;
            let imageUrl = '';

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
                if (!imageUrl) {
                    setMessage('Error al subir la imagen');
                    return;
                }
            }

            let result;
            if (currentNews) {
                // Actualizar noticia existente
                result = await supabase
                    .from('news')
                    .update({ title, image_url: imageUrl, content, author, created_at: createdAt, category })
                    .eq('id', currentNews.id)
                    .select(); // Fuerza a retornar los datos actualizados
            } else {
                // Insertar nueva noticia
                result = await supabase
                    .from('news')
                    .insert([{ title, image_url: imageUrl, content, author, created_at: createdAt, category }])
                    .select(); // Fuerza a retornar los datos insertados
            }

            if (result.error) throw result.error;

            if (result.data && result.data.length > 0) {
                setMessage('Noticia guardada exitosamente');
                setNews(currentNews
                    ? news.map(n => n.id === result.data[0].id ? result.data[0] : n)
                    : [...news, result.data[0]]
                );
                setForm({
                    title: '',
                    imageFile: null,
                    imagePreview: '',
                    content: '',
                    author: '',
                    createdAt: '',
                    category: '' // Resetear categoría
                });
                setCurrentNews(null);
                setIsModalOpen(false);
            } else {
                throw new Error('No se recibieron datos al guardar la noticia.');
            }
        } catch (error) {
            console.error('Error al guardar la noticia:', error.message);
            setMessage('Error al guardar la noticia: ' + error.message);
        }
    };

    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'ml_default'); // Verifica tu preset en Cloudinary

            const response = await fetch(`https://api.cloudinary.com/v1_1/djieishbb/image/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.error) {
                console.error('Error al subir la imagen:', data.error.message);
                return null;
            }

            return data.secure_url; // Retorna la URL de la imagen subida
        } catch (error) {
            console.error('Error inesperado al subir la imagen:', error.message);
            return null;
        }
    };

    const handleDelete = async (newsId) => {
        try {
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
        } catch (error) {
            console.error('Error inesperado al eliminar la noticia:', error.message);
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
                                className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                            <input
                                type="date"
                                name="createdAt"
                                value={form.createdAt}
                                onChange={handleChange}
                                className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-lg shadow-sm w-full"
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="PrimerEquipo">Primer Equipo</option>
                            <option value="Opinión">Opinión y Analisis</option>
                            <option value="BarçaAtlético">Barça Atlético</option>
                            <option value="Baloncesto">Baloncesto</option>
                            <option value="Fútbol Sala">Fútbol Sala</option>
                            <option value="Balonmano">Balonmano</option>
                            {/* Añade más opciones según sea necesario */}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200 mt-4"
                    >
                        Guardar
                    </button>
                </form>
                {message && <p className="text-green-600 mt-4">{message}</p>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-3">Noticias</h2>
                {news.length === 0 && <p className="text-center">No hay noticias disponibles.</p>}
                {news.map((newsItem) => (
                    <div key={newsItem.id} className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                        <div>
                            <h3 className="text-lg font-semibold">{newsItem.title}</h3>
                            <p className="text-sm text-gray-600">{newsItem.content}</p>
                            {newsItem.image_url && (
                                <img src={newsItem.image_url} alt="Imagen de noticia" className="mt-2 w-32 h-32 object-cover rounded-md" />
                            )}
                            <p className="text-sm text-gray-600 mt-2"><strong>Categoría:</strong> {newsItem.category}</p>
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
                                        createdAt: newsItem.created_at.split('T')[0],
                                        category: newsItem.category // Añadir categoría al formulario
                                    });
                                    setCurrentNews(newsItem);
                                    setIsModalOpen(true);
                                }}
                                className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => setConfirmDelete(newsItem.id)}
                                className="bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow hover:bg-red-700 transition duration-200"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">{currentNews ? 'Editar Noticia' : 'Nueva Noticia'}</h2>
                        <form onSubmit={handleSaveNews}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2" htmlFor="title">Título</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2" htmlFor="imageFile">Imagen</label>
                                <input
                                    type="file"
                                    id="imageFile"
                                    name="imageFile"
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                                {form.imagePreview && (
                                    <img src={form.imagePreview} alt="Vista previa" className="w-32 h-32 mt-2 object-cover" />
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2" htmlFor="content">Contenido</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2" htmlFor="author">Autor</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={form.author}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2" htmlFor="createdAt">Fecha</label>
                                <input
                                    type="date"
                                    id="createdAt"
                                    name="createdAt"
                                    value={form.createdAt}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-2" htmlFor="category">Categoría</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="Primer Equipo">Primer Equipo</option>
                                    <option value="Opinion">Opinión y Analisis</option>
                                    <option value="BarçaAtlético">Barça Atlético</option>
                                    <option value="Baloncesto">Baloncesto</option>
                                    <option value="FutbolSala">Fútbol Sala</option>
                                    <option value="Balonmano">Balonmano</option>
                                    {/* Añade más opciones según sea necesario */}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition duration-200 mr-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                        <p className="mb-4">¿Estás seguro de que quieres eliminar esta noticia?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete)}
                                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-700 transition duration-200"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;