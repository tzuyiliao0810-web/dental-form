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
      const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '=='.slice(0, (4 - base64.length % 4) % 4);
      data = JSON.parse(atob(padded));
    } catch(e) {
      console.error('decode error', e);
    }
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
            <div