// app/api/news/route.js
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req) {
    const { title, imageUrl, content, author } = await req.json();

    const { data, error } = await supabase
        .from('news')
        .insert([{ title, image_url: imageUrl, content, author }]);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
}
