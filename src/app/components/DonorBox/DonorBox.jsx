"use client"
import { useEffect } from 'react';

const DonorboxForm = () => {
    useEffect(() => {
        // Crear y agregar el script al DOM
        const script = document.createElement('script');
        script.src = "https://donorbox.org/widget.js";
        script.setAttribute('paypalExpress', 'false');
        script.async = true;

        document.body.appendChild(script);

        // Limpiar el script al desmontar el componente
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="donorbox-container" style={{ maxWidth: '500px', minWidth: '250px' }}>
            <iframe
                src="https://donorbox.org/embed/donaciones-diez-del-barca?language=es"
                name="donorbox"
                allowpaymentrequest="allowpaymentrequest"
                seamless="seamless"
                frameBorder="0"
                scrolling="no"
                height="900px"
                width="100%"
                style={{ maxWidth: '500px', minWidth: '250px', maxHeight: 'none!important' }}
                allow="payment"
            ></iframe>
        </div>
    );
};

export default DonorboxForm;
