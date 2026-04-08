import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { match, league, odds } = body || {};

    const prompt = `Adj rövid sportfogadási elemzést magyarul ehhez a meccshez: ${match || 'ismeretlen meccs'}, liga: ${league || 'ismeretlen liga'}, odds: ${odds || 'n/a'}. Adj százalékos jelzést, 1-4 unit javaslatot, rövid indoklást és value megjegyzést.`;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        ok: true,
        mock: true,
        summary: 'Erős hazai oldal, a forma és a piaci ár együtt támogató képet ad.',
        signal: 74,
        unit: 3,
        valueLabel: 'Mérsékelt value'
      });
    }

    const result = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: prompt,
      })
    });

    const json = await result.json();
    const text = json.output_text || 'Nincs visszaadott elemzés.';

    return NextResponse.json({ ok: true, text, raw: json });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
