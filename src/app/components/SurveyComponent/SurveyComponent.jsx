
const GoogleForm = () => {
    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfVdi1suy8yt9mYEUduIS1mb-kHnQUbQFvvLTEjOS16HAg2zQ/viewform?embedded=true"
                style={{ width: '100%', height: '90%', border: 'none' }}
                title="Google Form"
            >
                Loading…
            </iframe>
        </div>
    );
};

export default GoogleForm;
