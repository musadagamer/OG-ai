exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    if (!apiKey) {
      console.error('Missing ELEVEN_LABS_API_KEY env var');
      return { statusCode: 500, body: 'Server misconfigured: ELEVEN_LABS_API_KEY is not set' };
    }

    const { text } = JSON.parse(event.body);
    const VOICE_ID = 'ErXwobaYiN019PkySvjV';

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.4, similarity_boost: 0.8 }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('ElevenLabs error', res.status, errText);
      return { statusCode: 500, body: `ElevenLabs error ${res.status}: ${errText}` };
    }

    const buffer = await res.arrayBuffer();
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch(e) {
    return { statusCode: 500, body: 'Error: ' + e.message };
  }
};
