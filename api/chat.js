export const config = {
  runtime: 'edge', // Runs faster on Vercel's Edge Network
};

export default async function handler(req) {
  // Only allow POST requestsa
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    
    // Access the key securely from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "Server Error: API Key configuration missing on host." } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call Google Gemini API from the server side
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Send the result back to your website
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
