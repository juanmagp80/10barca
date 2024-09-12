"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
// Ajusta la ruta si es necesario

const NewsDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching article:', error);
                } else {
                    setArticle(data);
                }
            };

            fetchArticle();
        }
    }, [id]);

    if (!article) {
        return <p className="text-center">Cargando...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                {article.image_url && (
                    <img src={article.image_url} alt={article.title} className="w-full h-auto rounded-md mb-4" />
                )}
                <p className="text-gray-700 mb-4">{article.content}</p>
                <p className="text-gray-500">Autor: {article.author}</p>
                <p className="text-gray-500">Fecha: {new Date(article.created_at).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default NewsDetail;