"use client"
import TeamCard from './TeamCard';

const Team = () => {
    const teamMembers = [
        {
            name: 'Juan Pérez',
            image: '/images/juan.jpg',
            description: 'Desarrollador Frontend con 5 años de experiencia en React.',
        },
        {
            name: 'María González',
            image: '/images/maria.jpg',
            description: 'Diseñadora UX/UI especializada en experiencias de usuario.',
        },
        {
            name: 'Carlos Ruiz',
            image: '/images/carlos.jpg',
            description: 'Ingeniero de Software con pasión por la inteligencia artificial.',
        },
        // Añade más miembros del equipo aquí
    ];

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-8">
            {teamMembers.map((member, index) => (
                <TeamCard
                    key={index}
                    name={member.name}
                    image={member.image}
                    description={member.description}
                />
            ))}
        </div>
    );
};

export default Team;
