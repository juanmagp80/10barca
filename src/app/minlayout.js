"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewsCards from './components/NewsCards/NewsCards';
import './globals.css';

export default function RootLayout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [showSections, setShowSections] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Ejecuta una vez al montar el componente

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <html lang="en">

            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Dosis:wght@400;700&display=swap"
                />
            </head>
            <body className="font-dosis">
                <header className="relative w-full h-screen">
                    <Image
                        src="/portada10.jpg"
                        alt="Background"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={true}
                        className="absolute inset-0 z-0"
                    />
                    <nav className={`fixed top-0 left-0 w-full p-6 z-10 transition-all duration-300 ${scrolled ? 'bg-white shadow-md text-black' : 'bg-transparent text-white'}`}>
                        <div className="flex justify-between items-center">
                            {/* Logo */}
                            <div className="text-2xl font-dosis font-bold">
                                <Image src="/logo10.jpg" alt="Logo" width={100} height={100} className="rounded-xl" />
                            </div>
                            {/* Menu */}
                            <ul className="flex space-x-6 font-dosis text-2xl items-center">
                                <li>
                                    <Link href="/" className="hover:text-red-500 transition-colors">Inicio</Link>
                                </li>
                                <li>
                                    <Link href="/team" className="hover:text-red-500 transition-colors">Nuestro Equipo</Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-red-500 transition-colors">Noticias Primer Equipo</Link>
                                </li>
                                <li>
                                    <Link href="/services" className="hover:text-red-500 transition-colors">Opinión y Analisis</Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-red-500 transition-colors">Barca Atlétic</Link>
                                </li>
                                <li className="relative">
                                    <button
                                        onClick={() => setShowSections(!showSections)}
                                        className="flex items-center hover:text-red-500 transition-colors"
                                    >
                                        Secciones
                                        <span className={`ml-2 transform transition-transform ${showSections ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </button>
                                    {/* Menú desplegable */}
                                    <div className={`absolute top-full left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg transition-max-height duration-300 ease-in-out overflow-hidden ${showSections ? 'max-h-40' : 'max-h-0'}`}>
                                        <ul className="py-2">
                                            <li className="px-4 py-2 hover:bg-gray-100">
                                                <Link href="/basketball">Baloncesto</Link>
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100">
                                                <Link href="/futsal">Fútbol Sala</Link>
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100">
                                                <Link href="/handball">Balonmano</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
                        <h1 className="text-7xl font-bold mb-4 leading-tight">El 10 del Barça</h1>
                        <p className="text-3xl">La mejor información diaria sobre el FC Barcelona.</p>
                    </div>
                </header>
                <main>{children}</main>
                <NewsCards />

            </body>
        </html>
    );
}
