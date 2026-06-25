'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PreviewContent() {
  const params = useSearchParams();
  const encoded = params.get('d');
  
  let data: any = {
    orderNumber: "071456",
    clinic: "心絡", doctor: "張", patient: "陳芸綾",
    age: "", gender: "女",
    receiptDate: "6月23日", deliveryDate: "7月17日", deliveryTime: "18:00前",
    zirconiaType: "Standard", zirconiaWork: ["Full Crown"],
    emaxWork: [], implantType: "", implantMaterial: "",
    implantConnect: "", implantBrand: "", implantSystem: "", implantSize: "",
    other: ["3D Printer Model"], toothColor: "",
    toothNotes: "6 | 6", connection: "單顆",
    notes: "手術導板\n口掃+LT\n做成一組目"
  };

  if (encoded) {
    try {
      data = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    } catch(e) {}
  }

  return (
    <div className="bg-white min-h-screen p-4 font-sans text-sm" style={{maxWidth:'800px', margin:'0 auto'}}>
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-3">
        <div className="text-xs text-gray-600 space-y-0.5">
          <div>TEL：(02)2260-6101</div>
          <div>FAX：(02)8262-5686</div>
          <div>LINE：Caterpillar1721</div>
          <div>地址：新北市土城區明德路一段313巷9號</div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">綠毛蟻牙體技術所</h1>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">NO: {data.orderNumber}</div>
          <div className="text-xs mt-1">第一聯（白）牙技所留存</div>
          <div className="text-xs">第二聯（紅）牙技所留存</div>
          <div className="text-xs">第三聯（黃）診所留存</div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <table className="w-full border border-black text-xs">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 bg-gray-100 font-bold w-8" rowSpan={4}>基本資料</td>
                <td className="border border-black px-2 py-1 w-16">診所</td>
                <td className="border border-black px-2 py-1 font-bold">{data.clinic}</td>
                <td className="border border-black px-2 py-1 w-16" rowSpan={2}>收付時間</td>
                <td className="border border-black px-2 py-1">收件日：{data.receiptDate}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">醫師</td>
                <td className="border border-black px-2 py-1 font-bold">{data.doctor}</td>
                <td className="border border-black px-2 py-1">交件日：{data.deliveryDate}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">患者</td>
                <td className="border border-black px-2 py-1 font-bold">{data.patient}</td>
                <td className="border border-black px-2 py-1" rowSpan={2}>
                  <div className="flex gap-2">
                    <label><input type="checkbox" checked={data.deliveryTime==='12:00前'} readOnly /> 12:00前</label>
                    <label><input type="checkbox" checked={data.deliveryTime==='18:00前'} readOnly /> 18:00前</label>
                  </div>
                  <div className="text-xs mt-1">※請務必勾選時間</div>
                </td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1">年齡</td>
                <td className="border border-black px-2 py-1">{data.age} □男 {data.gender==='女'?'☑':'□'}女</td>
                <td className="border border-black px-2 py-1"></td>
              </tr>
            </tbody>
          </table>

          <div className="border border-black mt-2 p-2">
            <div className="font-bold italic text-base mb-1">Zirconia</div>
            <div className="flex gap-3 text-xs mb-1">
              <label><input type="checkbox" checked={data.zirconiaType==='Standard'} readOnly /> Standard</label>
              <label><input type="checkbox" checked={data.zirconiaType==='3M Lava'} readOnly /> 3M Lava</label>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {['Full Crown','咬鉻','燒瓷冠','Post'].map((w:string) => (
                <label key={w}><input type="checkbox" checked={(data.zirconiaWork||[]).includes(w)} readOnly /> {w}</label>
              ))}
            </div>
          </div>

          <div className="border border-black mt-2 p-2">
            <div className="font-bold italic text-base mb-1">E-Max</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {['Full Crown','燒瓷冠','Veneer','In/onlay'].map((w:string) => (
                <label key={w}><input type="checkbox" checked={(data.emaxWork||[]).includes(w)} readOnly /> {w}</label>
              ))}
            </div>
          </div>

          <div className="border border-black mt-2 p-2">
            <div className="font-bold italic text-base mb-1">Other</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {['Provisional (Temp)','美白牙托','3D Printer Model','Wax Up'].map((w:string) => (
                <label key={w}><input type="checkbox" checked={(data.other||[]).includes(w)} readOnly /> {w}</label>
              ))}
            </div>
          </div>
        </div>

        <div className="w-56">
          <div className="border border-black p-2">
            <div className="font-bold italic text-base mb-1">Implant Type</div>
            <div className="flex gap-2 text-xs mb-1">
              {['Custom','Standard'].map((t:string) => (
                <label key={t}><input type="checkbox" checked={data.implantType===t} readOnly /> {t}</label>
              ))}
            </div>
            <div className="flex gap-2 text-xs mb-1">
              {['Ti','Zr'].map((t:string) => (
                <label key={t}><input type="checkbox" checked={data.implantMaterial===t} readOnly /> {t}</label>
              ))}
            </div>
            <div className="text-xs mb-1">□ 加購Screw x____支</div>
            <div className="text-xs mb-1"><label><input type="checkbox" checked={data.implantConnect==='Screw Type'} readOnly /> Screw Type</label></div>
            <div className="text-xs"><label><input type="checkbox" checked={data.implantConnect==='Cement Type'} readOnly /> Cement Type</label></div>
          </div>

          <div className="border border-black mt-2 p-2">
            <div className="font-bold italic text-base mb-1">Accessories</div>
            <div className="text-xs space-y-1">
              {['Screw','Analog','Transfer','Abutment','Scan bodies','Tray'].map((l:string) => (
                <div key={l} className="flex justify-between">
                  <span>□ {l}</span><span>x ____支</span>
                </div>
              ))}
            </div>
            <div className="text-xs mt-2 space-y-1">
              <div>植體廠牌：{data.implantBrand || '___________'}</div>
              <div>植體系統：{data.implantSystem || '___________'}</div>
              <div>植體尺寸：{data.implantSize || '___________'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-black mt-2 flex">
        <div className="flex-1 p-2 border-r border-black">
          <div className="text-xs font-bold mb-2">牙位</div>
          <div className="flex justify-center gap-1 my-2">
            {[8,7,6,5,4,3,2,1,1,2,3,4,5,6,7,8].map((n:number,i:number) => (
              <div key={i} className="w-6 h-8 border border-black rounded-t-full bg-gray-100 flex items-end justify-center text-xs pb-0.5">{n}</div>
            ))}
          </div>
          <div className="border-t border-black my-1"></div>
          <div className="text-center text-xs mt-1 font-bold">{data.toothNotes}</div>
          <div className="mt-3 text-xs space-y-1">
            {['單顆','連接','收到Case請回電與Dr.討論'].map((c:string) => (
              <label key={c} className="flex items-center gap-1">
                <input type="radio" checked={data.connection===c} readOnly /> {c}
              </label>
            ))}
          </div>
        </div>
        <div className="w-48 p-2">
          <div className="text-xs font-bold mb-1">備註</div>
          <div className="text-sm whitespace-pre-line">{data.notes}</div>
        </div>
      </div>

      <div className="mt-4 text-center print:hidden">
        <button onClick={() => window.print()}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          列印指示單
        </button>
      </div>
    </div>
  );
}

export default function Preview() {
  return (
    <Suspense fallback={<div className="p-8 text-center">載入中...</div>}>
      <PreviewContent />
    </Suspense>
  );
}