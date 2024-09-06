
const ModalComoUnirse = ({ isOpen, onClose, videoUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-3xl">
                <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
                    ✖
                </button>
                {/* Botón en la esquina superior derecha para cerrar */}
                <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
                    ✖
                </button>

                <div className="aspect-w-16 aspect-h-9">
                    <iframe
                        width="100%"
                        height="315"
                        src={videoUrl}
                        title="Cómo Unirse"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Botón adicional para cerrar el modal debajo del video */}
                <div className="text-center mt-6">
                    <button
                        onClick={onClose}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalComoUnirse;
