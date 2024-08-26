import { useEffect, useState } from 'react';

const LastLiveStream = ({ channelId, apiKey }) => {
    const [liveStream, setLiveStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLiveStream = async () => {
            try {
                // Primero, intentamos obtener el stream en directo
                let response = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}&order=date`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let data = await response.json();
                console.log('Live Stream API Response:', data);

                // Verificar si hay un video en directo
                const liveVideo = data.items.find(item => item.snippet.liveBroadcastContent === 'live');

                if (liveVideo) {
                    setLiveStream({
                        videoId: liveVideo.id.videoId,
                        title: liveVideo.snippet.title,
                    });
                } else {
                    // Si no hay video en directo, buscar el último video emitido en vivo
                    response = await fetch(
                        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=completed&key=${apiKey}&order=date`
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    data = await response.json();
                    console.log('Last Video API Response:', data);

                    // Encontrar el último video emitido
                    const lastLiveVideo = data.items
                        .filter(item => item.snippet.liveBroadcastContent === 'none')
                        .sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt))[0]; // Ordenar por fecha

                    if (lastLiveVideo) {
                        setLiveStream({
                            videoId: lastLiveVideo.id.videoId,
                            title: lastLiveVideo.snippet.title,
                        });
                    } else {
                        setLiveStream(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching live stream:', error);
                setError('Error fetching live stream: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveStream();
    }, [channelId, apiKey]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!liveStream) {
        return <div>No live stream or recent broadcast available.</div>;
    }

    return (
        <div className="live-stream pt-8 rounded-xl" style={{ textAlign: 'center' }}>

            <div

                className="video-container rounded-xl"
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '56.25%', // 16:9 aspect ratio
                    backgroundImage: 'url(/fati.jpg)', // Background image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    margin: '0 auto',
                    overflow: 'hidden',
                    borderRadius: '20px',
                }}
            >
                <h1 className='text-white pt-8 text-3xl'>{liveStream.title}</h1>
                <div
                    className="iframe-wrapper"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '80%',
                        maxWidth: '800px',
                        maxHeight: '450px',
                        zIndex: 1,
                        borderRadius: '20px',
                    }}
                >
                    <iframe
                        src={`https://www.youtube.com/embed/${liveStream.videoId}?autoplay=1`}
                        title={liveStream.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '20px',
                        }}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default LastLiveStream;
