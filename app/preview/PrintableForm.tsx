'use client';

import ToothChart from '../components/ToothChart';

/* 小方框（checkbox） */
function Ck({ on, children }: { on?: boolean; children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="inline-block w-3.5 h-3.5 border border-black text-[10px] leading-[13px] text-center text-black">{on ? '✓' : ''}</span>
      {children != null && <span className="text-black">{children}</span>}
    </span>
  );
}

/* 圓框（radio） */
function Rd({ on, children }: { on?: boolean; children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="inline-block w-3.5 h-3.5 rounded-full border border-black relative">
        {on && <span className="absolute inset-1 rounded-full bg-black" />}
      </span>
      {children != null && <span className="text-black">{children}</span>}
    </span>
  );
}

function fill(v: unknown, width = 8) {
  const s = v == null || v === '' ? '' : String(v);
  return s || '_'.repeat(width);
}

export default function PrintableForm({ data }: { data: any }) {
  const d = data || {};
  const arr = (k: string): string[] => Array.isArray(d[k]) ? d[k] : [];
  const teeth: string[] = Array.isArray(d.teeth) ? d.teeth : [];

  return (
    <div className="bg-white px-3 py-2 text-[13px] text-black"
      style={{ maxWidth: '820px', margin: '0 auto', fontFamily: 'system-ui, "PingFang TC", "Microsoft JhengHei", sans-serif' }}>

      {/* 列印樣式：強制單頁、隱藏按鈕 */}
      <style>{`
        @media print {
          @page { size: A4; margin: 8mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          * { page-break-inside: avoid !important; }
          html, body { height: auto !important; }
        }
        * { color: black !important; }
      `}</style>

      {/* ===== 抬頭 ===== */}
      <div className="flex justify-between items-center border-b-2 border-black pb-1 mb-2">
        <div className="text-[9px] leading-[14px] text-black">
          <div>TEL：(02)2260-6101</div>
          <div>FAX：(02)8262-5686</div>
          <div>LINE：Caterpillar1721</div>
          <div>地址：新北市土城區明德路一段313巷9號</div>
        </div>
        <div className="text-center">
          <h1 className="text-[24px] font-bold tracking-wide text-black" style={{ fontFamily: '"KaiTi", "DFKai-SB", serif' }}>綠毛蟲牙體技術所</h1>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-bold text-red-600 leading-tight">NO：{d.orderNumber}</div>
        </div>
      </div>

      {/* ===== 基本資料 + 收付時間（各50%）===== */}
      <div className="flex border border-black">
        {/* 基本資料（50%） */}
        <div className="flex items-stretch flex-1">
          <div className="w-7 border-r border-black bg-gray-100 flex items-center justify-center font-bold text-black text-center px-1"
            style={{ writingMode: 'vertical-rl', letterSpacing: '2px' }}>基本資料</div>
          <table className="flex-1 text-[12px]">
            <tbody>
              <tr>
                <td className="px-2 py-1 w-12 align-top text-black">診所</td>
                <td className="px-2 py-1 border-b border-dotted border-gray-400 font-bold text-black">{d.clinic}</td>
              </tr>
              <tr>
                <td className="px-2 py-1 align-top text-black">醫師</td>
                <td className="px-2 py-1 border-b border-dotted border-gray-400 font-bold text-black">{d.doctor}</td>
              </tr>
              <tr>
                <td className="px-2 py-1 align-top text-black">患者</td>
                <td className="px-2 py-1 border-b border-dotted border-gray-400 font-bold text-black">{d.patient}</td>
              </tr>
              <tr>
                <td className="px-2 py-1 align-top text-black">年齡</td>
                <td className="px-2 py-1 text-black">
                  <span className="font-bold mr-3 text-black">{d.age}</span>
                  <span className="mr-3"><Ck on={d.gender === '男'}>男</Ck></span>
                  <Ck on={d.gender === '女'}>女</Ck>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 收付時間（50%） */}
        <div className="flex items-stretch flex-1 border-l border-black">
          <div className="w-7 border-r border-black bg-gray-100 flex items-center justify-center font-bold text-black text-center"
            style={{ writingMode: 'vertical-rl', letterSpacing: '2px' }}>收付時間</div>
          <div className="flex-1 px-3 py-1 text-[12px] leading-7 text-black">
            <div className="text-black">收件日：{fill(d.receiptDate, 12)}</div>
            <div className="text-black">交件日：{fill(d.deliveryDate, 12)}</div>
            <div className="flex gap-4 mt-1">
              <Ck on={d.deliveryTime === '12:00前'}>12:00前</Ck>
              <Ck on={d.deliveryTime === '18:00前'}>18:00前</Ck>
              <Ck on={d.deliveryTime === '正確裝戴時間'}>正確裝戴時間</Ck>
            </div>
            {d.deliveryTime === '正確裝戴時間' && d.fittingDate && (
              <div className="text-[11px] text-black">裝戴日：{d.fittingDate}</div>
            )}
            <div className="text-[11px] mt-1 text-black">※請務必勾選時間</div>
          </div>
        </div>
      </div>

      {/* ===== Zirconia / Implant Type / 植體資訊 ===== */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {/* Zirconia（含 Veneer、In/onlay） */}
        <div className="border border-black p-2">
          <div className="italic font-bold text-[17px] text-center border-b border-dashed border-black pb-1 mb-2 text-black">Zirconia</div>
          <div className="flex gap-3 mb-2">
            <Ck on={d.zirconiaType === 'Standard'}>Standard</Ck>
            <Ck on={d.zirconiaType === '3M Lava'}>3M Lava</Ck>
          </div>
          <div className="space-y-1">
            {['Full Crown', '燒瓷冠', 'Veneer', 'In/onlay'].map(w => (
              <div key={w}><Rd on={arr('zirconiaWork').includes(w)}>{w}</Rd></div>
            ))}
          </div>
        </div>

        {/* Implant Type（移到中欄） */}
        <div className="border border-black p-2">
          <div className="italic font-bold text-[17px] text-center border-b border-dashed border-black pb-1 mb-2 text-black">Implant Type</div>
          <div className="flex gap-3 mb-1">
            <Ck on={d.implantType === 'Custom'}>Custom</Ck>
            <Ck on={d.implantType === 'Standard'}>Standard</Ck>
          </div>
          <div className="flex gap-3 mb-1">
            <Ck on={d.implantMaterial === 'Ti'}>Ti</Ck>
            <Ck on={d.implantMaterial === 'Zr'}>Zr</Ck>
          </div>
          <div className="mb-1"><Ck on={!!d.screwCount}>加購Screw x{fill(d.screwCount, 4)}支</Ck></div>
          <div className="mb-1"><Ck on={d.implantConnect === 'Screw Type'}>Screw Type</Ck></div>
          <div><Ck on={d.implantConnect === 'Cement Type'}>Cement Type</Ck></div>
        </div>

        {/* 植體資訊（右欄） */}
        <div className="border border-black p-2">
          <div className="italic font-bold text-[17px] text-center border-b border-dashed border-black pb-1 mb-2 text-black">植體資訊</div>
          <div className="text-[12px] space-y-2 text-black">
            <div className="text-black">植體廠牌：{fill(d.implantBrand, 8)}</div>
            <div className="text-black">植體系統：{fill(d.implantSystem, 8)}</div>
            <div className="text-black">植體尺寸：{fill(d.implantSize, 8)}</div>
          </div>
        </div>
      </div>

      {/* ===== Other（全寬）===== */}
      <div className="border border-black mt-2 p-2">
        <div className="italic font-bold text-[17px] text-center border-b border-dashed border-black pb-1 mb-2 text-black">Other</div>

        {/* 上：勾選項目（橫排） */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3">
          <Ck on={arr('other').includes('Provisional (Temp)')}>Provisional (Temp)</Ck>
          <Ck on={arr('other').includes('美白牙托')}>美白牙托</Ck>
          <Ck on={arr('other').includes('3D Printer Model')}>3D Printer Model</Ck>
          <Ck on={arr('other').includes('Wax Up')}>Wax Up</Ck>
        </div>

        {/* 下：牙縫 / 牙溝染色 / 齒色（橫式排列） */}
        <div className="flex gap-8 items-start">
          {/* 牙縫（橫式） */}
          <div>
            <div className="font-bold text-[12px] mb-1 text-black">牙縫</div>
            <div className="flex gap-3">
              {['補強', '正常', '打開'].map(t => <span key={t}><Ck on={d.gap === t}>{t}</Ck></span>)}
            </div>
          </div>
          {/* 牙溝染色（橫式） */}
          <div>
            <div className="font-bold text-[12px] mb-1 text-black">牙溝染色</div>
            <div className="flex gap-3">
              {['輕', '中', '重'].map(t => <span key={t}><Ck on={d.grooveStain === t}>{t}</Ck></span>)}
            </div>
          </div>
          {/* 齒色 */}
          <div className="flex-1">
            <div className="font-bold text-[12px] mb-1 flex items-center gap-1 text-black">
              <span className="inline-block w-3 h-3 rounded-full bg-black" /> 齒色
            </div>
            <div className="flex justify-center gap-1 my-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-9 h-11 border border-black border-b-0"
                  style={{ borderTopLeftRadius: '45% 60%', borderTopRightRadius: '45% 60%' }} />
              ))}
            </div>
            <div className="border-t border-black pt-1 text-center text-[12px] font-bold text-black">{d.toothColor ? `色號：${d.toothColor}` : ' '}</div>
            <div className="mt-1"><Ck on={!!d.porcelainGingiva}>porcelain gingiva</Ck></div>
          </div>
        </div>
      </div>

      {/* ===== 齒位（往上緊靠 Other）===== */}
      <div className="border border-black mt-2 p-2">
        <div className="text-center text-[12px] font-bold mb-1 text-black">齒位</div>
        <div className="flex justify-center my-1">
          <ToothChart selected={teeth} readOnly />
        </div>
        {d.toothNotes ? (
          <div className="text-center text-[12px] mt-1 text-black">補充：{d.toothNotes}</div>
        ) : null}
        <div className="flex flex-wrap gap-6 mt-2 text-[12px]">
          {(() => {
            const conn: string[] = Array.isArray(d.connection) ? d.connection : (d.connection ? [d.connection] : []);
            return <>
              <Ck on={conn.includes('單顆')}>單顆</Ck>
              <Ck on={conn.includes('連接')}>連接</Ck>
              <Ck on={conn.includes('收到Case請回電與Dr.討論')}>收到Case 請回電與Dr.討論</Ck>
            </>;
          })()}
        </div>
      </div>

      {/* ===== 備註欄（加大）===== */}
      <div className="border border-black mt-2 p-2" style={{ minHeight: '80px' }}>
        <div className="text-[12px] font-bold mb-1 text-black">備註 / 特殊指示</div>
        {d.notes ? (
          <div className="text-[12px] whitespace-pre-line text-black">{d.notes}</div>
        ) : (
          <div style={{ minHeight: '60px' }} />
        )}
      </div>

      {/* 列印按鈕（列印時隱藏） */}
      <div className="mt-3 text-center print:hidden">
        <button onClick={() => window.print()}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          列印指示單
        </button>
      </div>
    </div>
  );
}
