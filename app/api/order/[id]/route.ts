import { NextResponse } from 'next/server';
import { getSupabaseAdmin, supabaseEnabled } from '@/lib/supabase';

// 強制每次請求都重新查詢，不快取 —— 手機瀏覽器端會直接打這支 API 拿最新資料。
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStore = { 'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate' };

// TEMP DEBUG: 這版會回傳 HTTP 200 + 除錯資訊，方便直接在瀏覽器打開網址看出問題卡在哪。
// 確認沒問題後要把這段除錯邏輯拿掉，改回原本單純回 404/500 的版本。
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const debug: Record<string, unknown> = {
    receivedId: id ?? null,
    supabaseEnabled,
  };

  if (!id || !supabaseEnabled) {
    return NextResponse.json({ data: null, debug }, { headers: noStore });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from('orders')
      .select('data')
      .eq('order_number', id)
      .single();

    debug.queryError = error ? { message: error.message, code: (error as any).code } : null;
    debug.rowFound = !!row;

    if (error || !row) {
      return NextResponse.json({ data: null, debug }, { headers: noStore });
    }

    return NextResponse.json({ data: row.data, debug }, { headers: noStore });
  } catch (e) {
    debug.exception = e instanceof Error ? e.message : String(e);
    console.error('Supabase 讀取失敗：', e);
    return NextResponse.json({ data: null, debug }, { headers: noStore });
  }
}
