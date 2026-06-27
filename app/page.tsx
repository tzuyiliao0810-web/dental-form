'use client';
import { useState } from 'react';

type Form = {
  clinic: string; doctor: string; patient: string; age: string; gender: string;
  receiptDate: string; deliveryDate: string; deliveryTime: string;
  zirconiaType: string; zirconiaWork: string[];
  emaxWork: string[];
  implantType: string; implantMaterial: string; screwCount: string; implantConnect: string;
  other: string[];
  gap: string; grooveStain: string; toothColor: string; porcelainGingiva: boolean;
  screw: string; analog: string; transfer: string; abutment: string; scanBodies: string; tray: string;
  implantBrand: string; implantSystem: string; implantSize: string;
  toothNotes: string; connection: string; notes: string;
};

const initialForm: Form = {
  clinic: '', doctor: '', patient: '', age: '', gender: '',
  receiptDate: '', deliveryDate: '', deliveryTime: '',
  zirconiaType: '', zirconiaWork: [],
  emaxWork: [],
  implantType: '', implantMaterial: '', screwCount: '', implantConnect: '',
  other: [],
  gap: '', grooveStain: '', toothColor: '', porcelainGingiva: false,
  screw: '', analog: '', transfer: '', abutment: '', scanBodies: '', tray: '',
  implantBrand: '', implantSystem: '', implantSize: '',
  toothNotes: '', connection: '', notes: '',
};

export default function DentalForm() {
  const [form, setForm] = useState<Form>(initialForm);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const arrField = (f: keyof Form) => (form[f] as string[]);
  const toggle = (field: keyof Form, val: string) => {
    setForm(f => {
      const cur = f[field] as string[];
      return { ...f, [field]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] };
    });
  };
  const set = (field: keyof Form, val: string | boolean) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setDone(true);
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-700">指示單已送出！</h1>
        <p className="text-gray-500 mt-2">牙技所將收到 LINE 通知</p>
        <button onClick={() => { setForm(initialForm); setDone(false); }} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg">再填一張</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">

        {/* 標題 */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800">綠毛蟲牙體技術所</h1>
          <p className="text-gray-500 mt-1">線上指示單</p>
        </div>

        {/* 基本資料 */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">基本資料</h2>
          <div className="grid grid-cols-2 gap-4">
            {([['clinic', '診所'], ['doctor', '醫師'], ['patient', '患者']] as const).map(([k, l]) => (
              <div key={k}>
                <label className="text-sm text-gray-600">{l}</label>
                <input value={form[k] as string} onChange={e => set(k, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            ))}
            <div>
              <label className="text-sm text-gray-600">年齡</label>
              <input value={form.age} onChange={e => set('age', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-sm text-gray-600">性別</label>
              <div className="flex gap-4 mt-2">
                {['男', '女'].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={e => set('gender', e.target.value)} />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 收付日期 */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">收付時間</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">收件日</label>
              <input type="date" value={form.receiptDate} onChange={e => set('receiptDate', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">交件日</label>
              <input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">交件時間（請務必勾選）</label>
              <div className="flex gap-4">
                {['12:00前', '18:00前'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="deliveryTime" value={t} checked={form.deliveryTime === t} onChange={e => set('deliveryTime', e.target.value)} />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Zirconia */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-purple-500 pl-3">Zirconia</h2>
          <div className="flex gap-6 mb-3">
            {['Standard', '3M Lava'].map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="zType" value={t} checked={form.zirconiaType === t} onChange={e => set('zirconiaType', e.target.value)} />
                <span>{t}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {['Full Crown', '咬鉻', '燒瓷冠', 'Post'].map(w => (
              <label key={w} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={arrField('zirconiaWork').includes(w)} onChange={() => toggle('zirconiaWork', w)} />
                <span>{w}</span>
              </label>
            ))}
          </div>
        </section>

        {/* E-Max */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-pink-500 pl-3">E-Max</h2>
          <div className="flex flex-wrap gap-4">
            {['Full Crown', '燒瓷冠', 'Veneer', 'In/onlay'].map(w => (
              <label key={w} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={arrField('emaxWork').includes(w)} onChange={() => toggle('emaxWork', w)} />
                <span>{w}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Implant */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-green-500 pl-3">Implant Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4">
              {['Custom', 'Standard'].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="iType" value={t} checked={form.implantType === t} onChange={e => set('implantType', e.target.value)} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              {['Ti', 'Zr'].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="iMat" value={t} checked={form.implantMaterial === t} onChange={e => set('implantMaterial', e.target.value)} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-sm text-gray-600">加購 Screw 數量</label>
              <input value={form.screwCount} onChange={e => set('screwCount', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="支" />
            </div>
            <div className="flex gap-4 items-center">
              {['Screw Type', 'Cement Type'].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="iConn" value={t} checked={form.implantConnect === t} onChange={e => set('implantConnect', e.target.value)} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Other */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-yellow-500 pl-3">Other</h2>
          <div className="flex flex-wrap gap-4">
            {['Provisional (Temp)', '美白牙托', '3D Printer Model', 'Wax Up'].map(w => (
              <label key={w} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={arrField('other').includes(w)} onChange={() => toggle('other', w)} />
                <span>{w}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 牙縫 / 牙溝染色 / 齒色 */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-teal-500 pl-3">牙縫 / 牙溝染色 / 齒色</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600 block mb-2">牙縫</label>
              <div className="flex gap-4">
                {['補強', '正常', '打開'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gap" value={t} checked={form.gap === t} onChange={e => set('gap', e.target.value)} />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">牙溝染色</label>
              <div className="flex gap-4">
                {['輕', '中', '重'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="grooveStain" value={t} checked={form.grooveStain === t} onChange={e => set('grooveStain', e.target.value)} />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">齒色（色號）</label>
              <input value={form.toothColor} onChange={e => set('toothColor', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="例：A2" />
            </div>
            <label className="flex items-center gap-2 mt-7 cursor-pointer">
              <input type="checkbox" checked={form.porcelainGingiva} onChange={e => set('porcelainGingiva', e.target.checked)} />
              <span className="text-sm">Porcelain Gingiva</span>
            </label>
          </div>
        </section>

        {/* Accessories */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-orange-500 pl-3">Accessories（數量）</h2>
          <div className="grid grid-cols-3 gap-3">
            {([['screw', 'Screw'], ['analog', 'Analog'], ['transfer', 'Transfer'], ['abutment', 'Abutment'], ['scanBodies', 'Scan bodies'], ['tray', 'Tray']] as const).map(([k, l]) => (
              <div key={k} className="flex items-center gap-2">
                <label className="text-sm text-gray-600 w-24">{l}</label>
                <input value={form[k] as string} onChange={e => set(k, e.target.value)}
                  className="flex-1 border rounded-lg px-2 py-1 text-sm" placeholder="數量" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {([['implantBrand', '植體廠牌'], ['implantSystem', '植體系統'], ['implantSize', '植體尺寸']] as const).map(([k, l]) => (
              <div key={k}>
                <label className="text-sm text-gray-600">{l}</label>
                <input value={form[k] as string} onChange={e => set(k, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
            ))}
          </div>
        </section>

        {/* 牙位 & 備註 */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-gray-500 pl-3">牙位 &amp; 備註</h2>
          <div>
            <label className="text-sm text-gray-600">牙位</label>
            <input value={form.toothNotes} onChange={e => set('toothNotes', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="例：#14 #15 或 6 | 6" />
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-600 block mb-2">連接方式</label>
            <div className="flex flex-wrap gap-6">
              {['單顆', '連接', '收到Case請回電與Dr.討論'].map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="conn" value={c} checked={form.connection === c} onChange={e => set('connection', e.target.value)} />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-600">特殊指示 / 備註</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full border rounded-lg px-3 py-2 mt-1 resize-none" placeholder="手術導板、口掃 + LT..." />
          </div>
        </section>

        {/* 送出 */}
        <button type="submit" disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition disabled:opacity-50">
          {loading ? '送出中...' : '送出指示單 →'}
        </button>
      </form>
    </div>
  );
}
