import { FaFacebook, FaInstagram, FaTwitch, FaWhatsapp, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-4 w-full">
            <div className="container mx-auto flex justify-between items-center px-6">
                <h1 className="text-2xl font-bold">El 10 del Barça</h1>
                <p className="text-2xl">Directos todos los días</p>

                <div className="flex space-x-4">
                    <a
                        href="https://www.youtube.com/c/El10delBar%C3%A7aTV"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-700 transition-colors"
                    >
                        <FaYoutube size={30} />
                    </a>
                    <a
                        href="https://www.twitch.tv/el10delbarca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700 transition-colors"
                    >
                        <FaTwitch size={30} />
                    </a>
                    <a
                        href="https://www.instagram.com/10delbarca/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-700 transition-colors"
                    >
                        <FaInstagram size={30} />
                    </a>
                    <a
                        href="https://www.facebook.com/El10delBarsa/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                        <FaFacebook size={30} />
                    </a>
                    <a
                        href="https://wa.me/34693691181"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700 transition-colors"
                    >
                        <FaWhatsapp size={30} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
