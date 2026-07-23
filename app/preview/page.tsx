'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PrintableForm from './PrintableForm';

// 在瀏覽器端解 base64url（對應送出時 Buffer.from(...).toString('base64url')）。
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

type State =
  | { kind: 'loading' }
  | { kind: 'ok'; data: any }
  | { kind: 'empty' }        // 沒有帶任何參數
  | { kind: 'notfound' };    // 有單號/資料但讀不到

function PreviewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const d = searchParams.get('d');

  const [state, setState] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1) 優先：用單號在手機端即時向 API 抓最新資料（每次都重新抓，不受快取影響）。
      if (id) {
        try {
          const res = await fetch(`/api/order/${encodeURIComponent(id)}`, {
            cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json();
            if (!cancelled && json?.data) {
              setState({ kind: 'ok', data: json.data });
              return;
            }
          }
        } catch (e) {
          console.error('讀取訂單資料失敗：', e);
        }
        // 有單號但讀不到（例如資料庫暫時無法連線）→ 顯示清楚提示，不顯示示範資料。
        if (!cancelled) setState({ kind: 'notfound' });
        return;
      }

      // 2) 後備：自帶資料的長連結（在瀏覽器端解碼，不經過資料庫）。
      if (d) {
        const decoded = decodeBase64Url(d);
        if (!cancelled) setState(decoded ? { kind: 'ok', data: decoded } : { kind: 'notfound' });
        return;
      }

      // 3) 沒有任何參數 → 空白提示。
      if (!cancelled) setState({ kind: 'empty' });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, d]);

  if (state.kind === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        載入中…
      </div>
    );
  }

  if (state.kind === 'ok') {
    return <PrintableForm data={state.data} />;
  }

  // empty / notfound：顯示清楚訊息，不再跳出示範資料。
  const msg =
    state.kind === 'notfound'
      ? '找不到這張指示單的資料。連結可能有誤，或資料庫暫時無法連線，請稍後再試或聯繫牙技所。'
      : '請從指示單連結開啟此頁面。';

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center text-gray-600 max-w-md">
        <div className="text-4xl mb-3">📋</div>
        <p>{msg}</p>
      </div>
    </div>
  );
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
