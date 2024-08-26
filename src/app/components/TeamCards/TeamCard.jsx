// components/TeamCards/TeamCard.jsx
import { useState } from 'react';

const TeamCard = ({ name, image, description }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className="relative w-64 h-80 perspective cursor-pointer"
            onClick={handleClick}
        >
            <div
                className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                {/* Lado frontal */}
                <div className="absolute w-full h-full bg-white rounded-lg shadow-lg backface-hidden flex flex-col items-center justify-center transition-transform duration-500 transform hover:scale-105 hover:shadow-2xl">
                    <img src={image} alt={name} className="w-full h-3/4 object-cover rounded-t-lg" />
                    <div className="p-4 text-center">
                        <h3 className="text-xl font-semibold">{name}</h3>
                    </div>
                </div>
                {/* Lado trasero */}
                <div className="absolute w-full h-full bg-gray-800 text-white rounded-lg shadow-lg backface-hidden rotate-y-180 flex flex-col items-center justify-center p-4">
                    <img src="/logo10.jpg" alt={name} className="w-40 h-40 object-cover mb-4 rounded-full" />
                    <p className="text-center text-2xl">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default TeamCard;
