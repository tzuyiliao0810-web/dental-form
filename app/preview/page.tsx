import PrintableForm from './PrintableForm';
import { getSupabaseAdmin, supabaseEnabled } from '@/lib/supabase';

// 預設示範資料：當沒有 id、沒有 d、或資料庫查不到時使用。
const defaultData = {
  orderNumber: '058438',
  clinic: '心絡', doctor: '張', patient: '陳芸綾',
  age: '', gender: '女',
  receiptDate: '2026-06-23', deliveryDate: '2026-07-17', deliveryTime: '18:00前',
  zirconiaType: 'Standard', zirconiaWork: ['Full Crown'],
  emaxWork: [] as string[],
  implantType: '', implantMaterial: '', screwCount: '', implantConnect: '',
  other: ['3D Printer Model'],
  gap: '正常', grooveStain: '中', toothColor: 'A2', porcelainGingiva: false,
  screw: '', analog: '', transfer: '', abutment: '', scanBodies: '', tray: '',
  implantBrand: '', implantSystem: '', implantSize: '',
  toothNotes: '6 | 6', connection: '單顆',
  notes: '手術導板\n口掃+LT\n做成一組目',
};

function decodeBase64(encoded: string) {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default async function Preview({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; d?: string }>;
}) {
  const { id, d } = await searchParams;
  let data: any = null;

  // 1) 優先：用單號從 Supabase 抓資料
  if (id && supabaseEnabled) {
    try {
      const supabase = getSupabaseAdmin();
      const { data: row, error } = await supabase
        .from('orders')
        .select('data')
        .eq('order_number', id)
        .single();
      if (!error && row) data = row.data;
    } catch (e) {
      console.error('Supabase 讀取失敗：', e);
    }
  }

  // 2) 後備：舊的 base64 連結
  if (!data && d) data = decodeBase64(d);

  // 3) 最後後備：示範資料
  if (!data) data = defaultData;

  return <PrintableForm data={data} />;
}
