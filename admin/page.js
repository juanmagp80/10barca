"use client"; // Importante para el renderizado del lado del cliente en Next.js

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Admin = () => {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn();
        }
    }, [status]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news');
                const data = await response.json();
                setNews(data.news);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (status === "loading") return <p>Loading...</p>;
    if (status === "unauthenticated") return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content || !image) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", image);

        try {
            const res = await fetch("/api/news", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Noticia guardada correctamente.");
                setTitle("");
                setContent("");
                setImage(null);
                // Refrescar la lista de noticias
                const response = await fetch('/api/news');
                const data = await response.json();
                setNews(data.news);
            } else {
                const errorData = await res.json();
                console.error("Error al guardar la noticia:", errorData);
                alert(`Error al guardar la noticia: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red al guardar la noticia.");
        }
    };

    const deleteNews = async (id) => {
        try {
            const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });

            if (res.ok) {
                alert("Noticia eliminada correctamente.");
                setNews(news.filter(newsItem => newsItem.id !== id));
            } else {
                const errorData = await res.json();
                console.error("Error al eliminar la noticia:", errorData);
                alert(`Error al eliminar la noticia: ${errorData.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red al eliminar la noticia.");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Administrador - Crear Noticia</h1>
            <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <label className="block mb-4">
                    <span className="text-gray-700">Título:</span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Contenido:</span>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Imagen:</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        required
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                </label>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Guardar Noticia
                </button>
            </form>
            <h2 className="text-xl font-semibold mt-8 mb-4">Noticias Existentes</h2>
            <ul className="space-y-4">
                {news.map(newsItem => (
                    <li key={newsItem.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <img src={newsItem.image} alt={newsItem.title} className="w-24 h-auto rounded-md" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">{newsItem.title}</h3>
                            <p className="text-gray-600">{newsItem.content}</p>
                        </div>
                        <button
                            onClick={() => deleteNews(newsItem.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Admin;
