"use client";
import emailjs from 'emailjs-com'; // Importar EmailJS
import { useRouter } from 'next/navigation'; // Importar useRouter de next/navigation
import { useState } from 'react';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter(); // Definir el router

    const handleSubmit = async (e) => {
        e.preventDefault();

        const templateParams = {
            name,
            email,
            message,
        };

        emailjs.send('service_e2syjso', 'template_oyrtcm3', templateParams, 'WbBBORiMpaPxmtXqJ')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                setSubmitted(true);
                setName('');
                setEmail('');
                setMessage('');

                setTimeout(() => {
                    router.push('/'); // Usar router para redirigir
                }, 2000);
            }, (error) => {
                console.error('FAILED...', error);
            });
    };

    return (
        <div className="contact-form-container p-8 mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-4xl font-bold mb-6">Formulario de Contacto</h2>
            {submitted ? (
                <p className="text-green-500 text-lg">¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</p>
            ) : (
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2" htmlFor="name">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2" htmlFor="message">
                            Mensaje
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows="6"
                            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                        />
                    </div>
                    <div className="mb-6 flex justify-center"> {/* Contenedor para centrar el botón */}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ContactForm;