import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, group, imagePath } = body || {};
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = group === 'vipplus'
      ? process.env.TELEGRAM_VIPPLUS_CHAT_ID
      : group === 'vip'
      ? process.env.TELEGRAM_VIP_CHAT_ID
      : process.env.TELEGRAM_FREE_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ ok: true, mock: true, message: 'Telegram kulcsok hiányoznak, mock küldés futott.' });
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL || '';
    const photoUrl = imagePath && site ? `${site}${imagePath}` : null;

    if (photoUrl) {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl,
          caption: message,
        })
      });
      const json = await response.json();
      return NextResponse.json({ ok: true, telegram: json });
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
    const json = await response.json();
    return NextResponse.json({ ok: true, telegram: json });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
