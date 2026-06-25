import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const orderNumber = `DL${Date.now()}`;
  const orderData = { ...data, orderNumber };

  const encoded = Buffer.from(JSON.stringify(orderData)).toString('base64url');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const previewUrl = `${baseUrl}/preview?d=${encoded}`;

  const message = `📋 新指示單 ${orderNumber}

🏥 診所：${data.clinic}
👨‍⚕️ 醫師：${data.doctor}
🧑 患者：${data.patient}（${data.gender}）
📅 交件日：${data.deliveryDate} ${data.deliveryTime}

👉 點此查看並列印指示單：
${previewUrl}`;

  const lineToken = process.env.LINE_CHANNEL_TOKEN;
  const lineUserId = process.env.LINE_USER_ID;

  let lineResult = null;

  if (lineToken && lineUserId) {
    const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lineToken}`
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [{ type: 'text', text: message }]
      })
    });
    lineResult = await lineRes.json();
    console.log('LINE API response:', JSON.stringify(lineResult));
  } else {
    console.log('Missing LINE token or user ID', { lineToken: !!lineToken, lineUserId: !!lineUserId });
  }

  return NextResponse.json({ success: true, orderNumber, lineResult });
}