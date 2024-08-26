// app/api/news/route.js

export async function GET(request) {
    try {
        const news = await fetchNewsFromDatabase(); // Implementa esta función
        return new Response(JSON.stringify({ news }), { status: 200 });
    } catch (error) {
        console.error('Error fetching news:', error);
        return new Response(JSON.stringify({ message: 'Error fetching news' }), { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const content = formData.get('content');
        const image = formData.get('image'); // Maneja la subida de imágenes según tu configuración

        await saveNewsToDatabase({ title, content, image }); // Implementa esta función
        return new Response(JSON.stringify({ message: 'News saved successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error saving news:', error);
        return new Response(JSON.stringify({ message: 'Error saving news' }), { status: 500 });
    }
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        await deleteNewsFromDatabase(id); // Implementa esta función
        return new Response(JSON.stringify({ message: 'News deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting news:', error);
        return new Response(JSON.stringify({ message: 'Error deleting news' }), { status: 500 });
    }
}
