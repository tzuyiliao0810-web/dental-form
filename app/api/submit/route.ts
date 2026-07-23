import { NextResponse } from 'next/server';
import { getSupabaseAdmin, supabaseEnabled } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const data = await req.json();
  const orderNumber = `DL${Date.now()}`;
  const orderData = { ...data, orderNumber };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 後備連結：把整張表單 base64 編碼塞進網址（較長，但不需資料庫也能顯示）。
  const encoded = Buffer.from(JSON.stringify(orderData)).toString('base64url');
  const fallbackUrl = `${baseUrl}/preview?d=${encoded}`;

  // 預設用「短連結」：資料成功存進 Supabase 後，連結只帶單號。
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
      // 存檔成功 → 用短連結（預覽頁再用單號向 API 抓資料）。
      previewUrl = `${baseUrl}/preview?id=${orderNumber}`;
    } catch (e) {
      dbError = e instanceof Error ? e.message : String(e);
      console.error('Supabase 存檔失敗，改用自帶資料的長連結：', dbError);
      previewUrl = fallbackUrl;
    }
  }

  // 齒位（表單點選的牙齒），顯示在 LINE 訊息裡方便一眼確認。
  const teeth = Array.isArray(data.teeth) ? data.teeth : [];
  const teethLabel = teeth.length ? teeth.join('、') : '（未選）';

  // 交件時間：若選「正確裝戴時間」，附上裝戴日期。
  const timeLabel = data.deliveryTime === '正確裝戴時間'
    ? `正確裝戴時間（${data.fittingDate || '未填日期'}）`
    : data.deliveryTime;

  const message = `📋 新指示單 ${orderNumber}

🏥 診所：${data.clinic}
👨‍⚕️ 醫師：${data.doctor}
🧑 患者：${data.patient}（${data.gender}）
🦷 齒位：${teethLabel}
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
