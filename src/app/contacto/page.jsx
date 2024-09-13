import ContactForm from "../components/ContactForm/ContactForm";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center bg"
            style={{
                backgroundImage: 'url(./fati.jpg', // Reemplaza con la ruta de tu imagen
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <ContactForm />
        </div>
    );
}
