import { NextResponse } from 'next/server';
import { getSupabaseAdmin, supabaseEnabled } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const data = await req.json();
  const orderNumber = `DL${Date.now()}`;
  const orderData = { ...data, orderNumber };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 一律把整張表單資料 base64 編碼後塞進預覽連結。
  // 預覽頁會在手機瀏覽器端直接解碼顯示，「完全不需要」再回資料庫讀取，
  // 因此不受 Vercel ↔ Supabase 連線狀態影響，單子一定看得到。
  const encoded = Buffer.from(JSON.stringify(orderData)).toString('base64url');
  const previewUrl = `${baseUrl}/preview?d=${encoded}`;

  // 仍嘗試把資料寫進 Supabase 作為存檔備份（best-effort）。
  // 這一步失敗也「不影響」預覽連結，只是少了一筆資料庫備份而已。
  let dbError: string | null = null;
  if (supabaseEnabled) {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        clinic: data.clinic ?? null,
        doctor: data.doctor ?? null,
        patient: data.patient ?? null,
        data: orderData,
      });
      if (error) throw error;
    } catch (e) {
      dbError = e instanceof Error ? e.message : String(e);
      console.error('Supabase 存檔失敗（不影響預覽連結）：', dbError);
    }
  }

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
        'Authorization': `Bearer ${lineToken}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [{ type: 'text', text: message }],
      }),
    });
    lineResult = await lineRes.json();
    console.log('LINE API response:', JSON.stringify(lineResult));
  } else {
    console.log('Missing LINE token or user ID', { lineToken: !!lineToken, lineUserId: !!lineUserId });
  }

  return NextResponse.json({ success: true, orderNumber, previewUrl, dbError, lineResult });
}
