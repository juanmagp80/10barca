import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NewsCards = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            const apiKey = '357713f33a1b4601b7a94b4a392c0a07'; // Tu clave API
            const query = 'FC Barcelona OR Barça'; // Múltiples palabras clave
            const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=es&apiKey=${apiKey}`);
            const data = await response.json();
            // Filtra y toma solo los 10 artículos más recientes
            const latestArticles = data.articles.slice(0, 10);
            setArticles(latestArticles);
        };

        fetchNews();
    }, []);

    return (
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
                <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
                >
                    {article.urlToImage && (
                        <Image
                            src={article.urlToImage}
                            alt={article.title}
                            width={800} // Ajusta el ancho según sea necesario
                            height={450} // Ajusta la altura según sea necesario
                            className="w-full h-48 object-cover" // Ajusta el alto de la imagen
                        />
                    )}
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                        <p className="text-gray-700 mb-4">{article.description}</p>
                        <Link href={article.url} className="text-blue-500 hover:underline">
                            Leer más
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsCards;
