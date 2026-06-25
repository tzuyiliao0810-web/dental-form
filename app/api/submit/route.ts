import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const orderNumber = `DL${Date.now()}`;
  const orderData = { ...data, orderNumber };

  // 把資料編碼放進網址
  const encoded = Buffer.from(JSON.stringify(orderData)).toString('base64url');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const previewUrl = `${baseUrl}/preview?d=${encoded}`;

  // LINE 訊息
  const message = `📋 新指示單 ${orderNumber}

🏥 診所：${data.clinic}
👨‍⚕️ 醫師：${data.doctor}
🧑 患者：${data.patient}（${data.gender}）
📅 交件日：${data.deliveryDate} ${data.deliveryTime}

👉 點此查看並列印指示單：
${previewUrl}`;

  const lineToken = process.env.LINE_CHANNEL_TOKEN;
  const lineUserId = process.env.LINE_USER_ID;

  if (lineToken && lineUserId) {
    await fetch('https://api.line.me/v2/bot/message/push', {
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
  }

  return NextResponse.json({ success: true, orderNumber });
}