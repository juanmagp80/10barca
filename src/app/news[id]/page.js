// app/news/[id]/page.js
import { supabase } from '../../../lib/supabaseClient';

export default async function NewsDetailsPage({ params }) {
    const { id } = params;
    const { data: news, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        return <p>Error al cargar la noticia.</p>;
    }

    return (
        <div>
            <h1>{news.title}</h1>
            <img src={news.image_url} alt={news.title} />
            <p><strong>Fecha:</strong> {new Date(news.created_at).toLocaleDateString()}</p>
            <p><strong>Redactor:</strong> {news.author}</p>
            <div>{news.content}</div>
        </div>
    );
}
