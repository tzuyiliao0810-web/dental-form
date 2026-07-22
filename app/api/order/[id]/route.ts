import { NextResponse } from 'next/server';
import { getSupabaseAdmin, supabaseEnabled } from '@/lib/supabase';

// 強制每次請求都重新查詢，不快取。
// 註：目前預覽連結一律採用 base64（?d=）自帶資料的方式，不依賴這支 API；
// 這支 API 保留作為「用單號查存檔備份」的用途，若 Supabase 連得上才有資料。
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStore = { 'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate' };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !supabaseEnabled) {
    return NextResponse.json({ data: null }, { status: 404, headers: noStore });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from('orders')
      .select('data')
      .eq('order_number', id)
      .single();

    if (error || !row) {
      return NextResponse.json({ data: null }, { status: 404, headers: noStore });
    }

    return NextResponse.json({ data: row.data }, { headers: noStore });
  } catch (e) {
    console.error('Supabase 讀取失敗：', e);
    return NextResponse.json({ data: null }, { status: 500, headers: noStore });
  }
}
