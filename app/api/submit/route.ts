import { NextResponse } from 'next/server';
import { getSupabaseAdmin, supabaseEnabled } from '@/lib/supabase';

export async function POST(req: Request) {
  const data = await req.json();
  const orderNumber = `DL${Date.now()}`;
  const orderData = { ...data, orderNumber };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 後備網址：把整包資料用 base64url 編碼塞進網址（舊作法）。
  // 當 Supabase 尚未設定，或寫入失敗時，仍可用這個連結正常顯示。
  const encoded = Buffer.from(JSON.stringify(orderData)).toString('base64url');
  const fallbackUrl = `${baseUrl}/preview?d=${encoded}`;

  let previewUrl = fallbackUrl;
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
      // 寫入成功 → 用短網址（只帶單號），預覽頁再從資料庫抓資料。
      previewUrl = `${baseUrl}/preview?id=${orderNumber}`;
    } catch (e) {
      dbError = e instanceof Error ? e.message : String(e);
      console.error('Supabase insert 失敗，改用 base64 連結：', dbError);
      previewUrl = fallbackUrl;
    }
  }

  const timeLabel = data.deliveryTime === '正確裝戴時間'
    ? `正確裝戴時間（${data.fittingDate || '未填日期'}）`
    : data.deliveryTime;

  const message = `📋 新指示單 ${orderNumber}

🏥 診所：${data.clinic}
👨‍⚕️ 醫師：${data.doctor}
🧑 患者：${data.patient}（${data.gender}）
📅 交件日：${data.deliveryDate} ${timeLabel}

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
