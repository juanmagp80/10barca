// app/news/page.js
import { supabase } from '../../lib/supabaseClient';

export default async function NewsPage() {
    const { data: newsList, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return <p>Error al cargar las noticias.</p>;
    }

    return (
        <div>
            <h1>Últimas Noticias</h1>
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
