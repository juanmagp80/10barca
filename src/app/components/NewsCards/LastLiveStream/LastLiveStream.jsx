import { useEffect, useState } from 'react';

const LastLiveStream = ({ channelId, apiKey }) => {
    const [liveStream, setLiveStream] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveStream = async () => {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}&order=date`
                );
                const data = await response.json();

                if (data.items && data.items.length > 0) {
                    const liveVideo = data.items[0];
                    setLiveStream({
                        videoId: liveVideo.id.videoId,
                        title: liveVideo.snippet.title,
                    });
                }
            } catch (error) {
                console.error('Error fetching live stream:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveStream();
    }, [channelId, apiKey]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!liveStream) {
        return <div>No live stream currently available.</div>;
    }

    return (
        <div className="live-stream" style={{ textAlign: 'center' }}>
            <h3>{liveStream.title}</h3>
            <div
                className="video-container"
                style={{
                    position: 'relative',
                    paddingBottom: '37.5%', // Aspect ratio for a smaller size, maintaining 16:9
                    height: 0,
                    width: '30%', // Smaller width
                    margin: '0 auto', // Centers the container horizontally
                    overflow: 'hidden',
                    backgroundColor: '#000',
                }}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${liveStream.videoId}?autoplay=1&mute=1`}
                    title={liveStream.title}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default LastLiveStream;
