"use client"
import { useEffect, useState } from 'react';
import { supabase } from "../../../../lib/supabaseClient";

export default function NewsFromCategory({ category }) {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            console.log("Fetching news data...");
            let query = supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching news:", error);
                setError(error);
            } else {
                console.log("News data:", data);
                setNewsList(data);
            }
            setLoading(false);
        };

        fetchNews();
    }, [category]);

    if (loading) {
        return <p>Cargando noticias...</p>;
    }

    if (error) {
        return <p>Error al cargar las noticias.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className='text-center text-4xl mb-8'>{category ? `Noticias del ${category}` : 'Últimas Noticias'}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newsList.map((news) => (
                    <div key={news.id} className="news-card bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <img src={news.image_url} alt={news.title} className="w-full h-48 object-cover rounded-t-lg" />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
                            <p className="text-gray-700 mb-4">{news.content.substring(0, 100)}...</p>
                            <a href={`/news/${news.id}`} className="text-blue-500 hover:underline">Leer más</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}