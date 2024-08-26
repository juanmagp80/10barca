"use client"
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function NewsPage() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            console.log("Fetching news data...");
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

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
    }, []);

    if (loading) {
        return <p>Cargando noticias...</p>;
    }

    if (error) {
        return <p>Error al cargar las noticias.</p>;
    }

    return (
        <div>
            <h1>Últimas Noticias api</h1>
            <div className="news-container">
                {newsList.map((news) => (
                    <div key={news.id} className="news-card">
                        <img src={news.image_url} alt={news.title} />
                        <h2>{news.title}</h2>
                        <p>{news.content.substring(0, 100)}...</p>
                        <a href={`/news/${news.id}`}>Leer más</a>
                    </div>
                ))}
            </div>
        </div>
    );
}