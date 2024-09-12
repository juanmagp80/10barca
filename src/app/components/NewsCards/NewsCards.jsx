import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient'; // Importar el cliente de Supabase

const NewsCards = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
                .from('news') // Reemplaza 'news' con el nombre de tu tabla en Supabase
                .select('id, title, image_url, content, author, created_at')
                .order('created_at', { ascending: false }) // Ordenar por fecha de creación
                .limit(10); // Limitar a los 10 artículos más recientes

            if (error) {
                console.error('Error fetching news:', error);
            } else {
                setArticles(data);
            }
        };

        fetchNews();
    }, []);

    const truncateText = (text, length) => {
        if (text.length <= length) {
            return text;
        }
        return text.substring(0, length) + '...';
    };

    return (
        <>
            <h1 className="text-5xl pt-8 text-center font-bold mb-4">Últimas noticias</h1>

            <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <div
                        key={article.id} // Asegúrate de que el ID se usa como clave
                        className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
                    >
                        {article.image_url && (
                            <Image
                                src={article.image_url} // Usar directamente la URL de Cloudinary
                                alt={article.title}
                                width={800} // Ajusta el ancho según sea necesario
                                height={450} // Ajusta la altura según sea necesario
                                className="w-full h-48 object-cover" // Ajusta el alto de la imagen
                            />
                        )}
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                            <p className="text-gray-700 mb-4">{truncateText(article.content, 100)}</p> {/* Truncar el texto a 100 caracteres */}
                            <Link href={`/news/${article.id}`} className="text-blue-500 hover:underline">
                                Leer más
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default NewsCards;