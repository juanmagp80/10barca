// pages/team/index.jsx
"use client";
import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import TeamCard from '../components/TeamCards/TeamCard';
const teamMembers = [
    { name: 'Miguel Angel Ruiz', image: '/miguelangel.jpg', description: 'Director y presentador' },
    { name: 'Jhonny Culé', image: '/jhonny.jpg', description: 'Productor Ejecutivo' },
    { name: 'Tomás Topelberg', image: '/Thomas.jpg', description: 'Editor de videos' },
    { name: 'David Valdearenas', image: '/valdearenas.jpg', description: 'Antimadridista Universal' },
    { name: 'Angel Gil', image: '/angelgil.jpeg', description: 'Narrador' },
    { name: 'Antonio Salcedo', image: '/antoniosalcedo.jpg', description: 'Editorial' },
    { name: 'Pablo de la Vega', image: '/pablodelavega.jpeg', description: 'Narrador' },
    { name: 'Adriá Regás', image: '/adraregas.jpeg', description: 'Colaborador' },
    { name: 'Angel Perez', image: '/angelperez.jpg', description: 'Presidente de Honor' },
    { name: 'Sergi Albert', image: '/sergialbert.jpg', description: 'Árbitro' },
    { name: 'Pablo Lucas', image: '/lucas.jpg', description: 'Tareas de producción' },
];

const TeamPage = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (

        <div
            className="relative"
            style={{
                backgroundImage: 'url(/fati.jpg)', // URL de la imagen de fondo
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px',
                minHeight: '100vh', // Asegura que el contenedor cubra al menos la altura de la ventana
            }}
        >
            {/* Contenedor del título centrado */}
            <div
                className="absolute top-1/6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-0 p-8 rounded-lg"
                style={{
                    width: '100%',
                    maxWidth: '600px', // Opcional: Ajusta según el tamaño deseado
                    textAlign: 'center',
                    zIndex: 10,
                }}
            >
                <h1 className="text-4xl font-bold text-white mb-4">Nuestro Equipo</h1>
            </div>

            {/* Contenedor de tarjetas centrado */}
            <div
                className="relative mt-32 flex flex-col items-center"
                style={{
                    zIndex: 1, // Asegura que las tarjetas estén debajo del título
                }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <TeamCard
                            key={index}
                            name={member.name}
                            image={member.image}
                            description={member.description}
                        />
                    ))}
                </div>
            </div>
            <Footer />

        </div>

    );
};


export default TeamPage;
