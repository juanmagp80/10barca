"use client";
import { useState } from 'react';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Aquí puedes añadir lógica para enviar los datos a un servidor o API

        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="contact-form-container p-8 mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Contacto</h2>
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
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                    >
                        Enviar
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;
