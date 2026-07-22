'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintableForm from './PrintableForm';

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

// 在瀏覽器端解 base64url（取代原本 Buffer.from 的伺服器端寫法）。
function decodeBase64Url(encoded: string) {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    const json = decodeURIComponent(
      Array.from(binary)
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function PreviewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const d = searchParams.get('d');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1) 優先：在手機瀏覽器端即時向 API 要單號對應的資料。
      //    每次都是瀏覽器重新發出的請求（cache: 'no-store'），
      //    不管伺服器或 CDN 怎麼快取頁面本身都不影響這次抓到的資料。
      if (id) {
        try {
          const res = await fetch(`/api/order/${encodeURIComponent(id)}`, {
            cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json();
            if (!cancelled && json?.data) {
              setData(json.data);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error('讀取訂單資料失敗：', e);
        }
      }

      // 2) 後備：舊的 base64 連結（同樣在瀏覽器端解碼，不經過伺服器）。
      if (d) {
        const decoded = decodeBase64Url(d);
        if (!cancelled && decoded) {
          setData(decoded);
          setLoading(false);
          return;
        }
      }

      // 3) 最後後備：示範資料。
      if (!cancelled) {
        setData(defaultData);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, d]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        載入中…
      </div>
    );
  }

  return <PrintableForm data={data} />;
}

export default function Preview() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          載入中…
        </div>
      }
    >
      <PreviewInner />
    </Suspense>
  );
}
