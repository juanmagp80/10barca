import DonorboxForm from '../components/DonorBox/DonorBox'; // Ajusta la ruta según la ubicación del archivo

const DonationPage = () => {
    return (
        <div className="donation-page">
            <h1>Haz tu donación</h1>
            <DonorboxForm />
        </div>
    );
};

export default DonationPage;
