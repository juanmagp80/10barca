import { useEffect, useState } from 'react';
import Slider from 'react-slick';

const LastMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures?league=140&season=2024&last=10', {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                        'X-RapidAPI-Key': '60ba791361mshfc017eb1bc381b9p1f8c2fjsnaeffd1ae0df7'
                    }
                });
                const data = await response.json();
                setMatches(data.response || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching matches:', error);
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    const translateRound = (round) => {
        if (round.includes("Regular Season")) {
            return round.replace("Regular Season", "Temporada Regular");
        }
        // Puedes añadir más traducciones según las respuestas que recibas de la API
        return round;
    };
    // Configuración para el carrusel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // Tomamos el round de uno de los partidos, asumiendo que todos pertenecen a la misma jornada
    const round = matches.length > 0 ? translateRound(matches[0].league.round) : "Jornada desconocida";

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">{round}</h2> {/* Mostrar el número de la jornada */}
            <Slider {...settings}>
                {matches.map((match) => (
                    <div key={match.fixture.id} className="p-4">
                        <div className="flex items-center justify-between border rounded p-4">
                            <div className="flex items-center">
                                <img src={match.teams.home.logo} alt={`${match.teams.home.name} logo`} className="w-16 h-16 mr-4" />
                                <p><strong>{match.teams.home.name}</strong></p>
                            </div>
                            <p className="text-center font-bold">
                                {match.score.fulltime.home} - {match.score.fulltime.away}
                            </p>
                            <div className="flex items-center">
                                <img src={match.teams.away.logo} alt={`${match.teams.away.name} logo`} className="w-16 h-16 mr-4" />
                                <p><strong>{match.teams.away.name}</strong></p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default LastMatches;
