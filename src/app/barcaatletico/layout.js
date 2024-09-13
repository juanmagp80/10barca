// src/app/news/primer-equipo/layout.js
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../globals.css';

export default function PrimerEquipoLayout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [showSections, setShowSections] = useState(false);
    const pathname = usePathname();

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
        <div className="font-dosis bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('./portada10.jpg')" }}>
            <header className="relative w-full">
                <nav className={`fixed top-0 left-0 w-full p-4 z-10 transition-all duration-300 ${scrolled ? 'bg-white shadow-md text-black' : 'bg-transparent text-white'}`}>
                    <div className="flex justify-between mr-16 items-center">
                        <div className="text-2xl font-dosis font-bold">
                            <Image src="/logo10.jpg" alt="Logo" width={100} height={100} className="rounded-xl" />
                        </div>
                        <ul className="flex space-x-6 font-dosis text-2xl items-center">
                            <li><Link href="/" className="hover:text-red-500 transition-colors">Inicio</Link></li>
                            <li><Link href="/team" className="hover:text-red-500 transition-colors">Nuestro Equipo</Link></li>
                            <li><Link href="/about" className="hover:text-red-500 transition-colors">Noticias Primer Equipo</Link></li>
                            <li><Link href="/contacto" className="hover:text-red-500 transition-colors">Contacto</Link></li>
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
                                {/* Menú desplegable con max-height animada */}
                                <div className={`absolute left-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${showSections ? 'max-h-70' : 'max-h-0'}`}>
                                    <ul className="py-2">
                                        <li className="px-4 py-2 hover:bg-gray-100"><Link href="/baloncesto">Baloncesto</Link></li>
                                        <li className="px-4 py-2 hover:bg-gray-100"><Link href="/futbolsala">Fútbol Sala</Link></li>
                                        <li className="px-4 py-2 hover:bg-gray-100"><Link href="/balonmano">Balonmano</Link></li>
                                        <li className="px-4 py-2 hover:bg-gray-100"><Link href="/opinion">Opinión y Analisis</Link></li>
                                        <li className="px-4 py-2 hover:bg-gray-100"><Link href="/barcaatletico">Barça Atlético</Link></li>
                                    </ul>
                                </div>

                            </li>
                        </ul>

                    </div>
                </nav>
                <main className="pt-48 text-white">
                    {children}
                </main>
            </header>

        </div>
    );

}
