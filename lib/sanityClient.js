import sanityClient from '@sanity/client';

export const client = sanityClient({
    projectId: 'your-project-id', // Reemplaza con tu ID de proyecto
    dataset: 'production',
    useCdn: true, // `false` si quieres datos frescos en cada solicitud
});