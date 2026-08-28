export default async function handler(req, res) {
  // Set CORS headers so your frontend can call this route seamlessly
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const APPS_SCRIPT_URL = 'https://script.google.com/a/macros/google.com/s/AKfycbyPV_L3tqkLOAKK9vEU1Sef6k1ZV6KGVgFM30J7h9LLHrxHtnwiqECc1wiBHESESngZDw/exec';

  try {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const googleResponse = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: payload,
      redirect: 'follow'
    });

    const data = await googleResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({
      ok: false,
      error: 'Proxy failure: ' + (error.message || String(error))
    });
  }
}
