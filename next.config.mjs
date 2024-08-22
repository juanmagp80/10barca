export default {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',  // Permite cualquier dominio
                pathname: '**',  // Permite cualquier ruta
            },
        ],
    },
};
