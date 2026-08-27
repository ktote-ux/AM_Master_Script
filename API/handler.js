// File: api/handler.js

export default async function handler(req, res) {
  // 1. Add CORS headers so your frontend doesn't block the request
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your actual domain in production
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. Handle pre-flight requests from the browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Block anything that isn't a POST request
  if (req.method !== "POST") {
    return res.status(405).json({ 
      ok: false, 
      error: "Method not allowed" 
    });
  }

  // Your exact Google Apps Script URL
  const APPS_SCRIPT_URL = "https://script.google.com/a/macros/google.com/s/AKfycbyDT9MZrC_5AF-0OFgrlPE8vgw_bwwGwxGWDXWFanSdOONtFt28X-Da7BMuPSbAfzcC/exec";

  try {
    // 4. Send the request to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        // CRUCIAL: Must be text/plain to bypass Google's strict CORS rules
        "Content-Type": "text/plain;charset=utf-8"
      },
      // Convert your frontend data into a string
      body: JSON.stringify(req.body),
      // CRUCIAL: Forces Vercel to follow Google's 302 redirect
      redirect: "follow" 
    });

    const text = await response.text();
    let data;

    // 5. Parse the response from Google Apps Script
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        ok: false,
        error: "Apps Script returned invalid JSON. It might be returning an HTML error page.",
        raw: text
      };
    }

    // 6. Send the final response back to your frontend
    return res.status(response.ok ? 200 : 500).json(data);

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Failed to connect to Google Apps Script: " + error.message
    });
  }
}
