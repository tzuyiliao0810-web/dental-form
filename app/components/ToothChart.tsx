'use client';

/* FDI 牙位編號（牙醫視角：面對患者，畫面左 = 患者右） */
// 上排：左半 Q1(18→11)、右半 Q2(21→28)
const UPPER_LEFT = ['18', '17', '16', '15', '14', '13', '12', '11'];
const UPPER_RIGHT = ['21', '22', '23', '24', '25', '26', '27', '28'];
// 下排：左半 Q4(48→41)、右半 Q3(31→38)
const LOWER_LEFT = ['48', '47', '46', '45', '44', '43', '42', '41'];
const LOWER_RIGHT = ['31', '32', '33', '34', '35', '36', '37', '38'];

function Tooth({
  num,
  on,
  readOnly,
  onToggle,
}: {
  num: string;
  on: boolean;
  readOnly?: boolean;
  onToggle?: (n: string) => void;
}) {
  const base =
    'flex flex-col items-center justify-center select-none transition-colors';
  if (readOnly) {
    // 預覽 / 列印：選取的牙位以實心圈標示
    return (
      <div className={`${base} w-7`}>
        <div
          className={
            'w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold border ' +
            (on
              ? 'bg-blue-600 text-white border-blue-700'
              : 'text-gray-400 border-transparent')
          }
        >
          {num}
        </div>
      </div>
    );
  }
  // 表單：可點選
  return (
    <button
      type="button"
      onClick={() => onToggle?.(num)}
      className={
        base +
        ' w-8 h-9 rounded-md border text-[12px] font-semibold cursor-pointer ' +
        (on
          ? 'bg-blue-600 text-white border-blue-700 shadow'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50')
      }
    >
      {num}
    </button>
  );
}

function Row({
  left,
  right,
  selected,
  readOnly,
  onToggle,
}: {
  left: string[];
  right: string[];
  selected: string[];
  readOnly?: boolean;
  onToggle?: (n: string) => void;
}) {
  const gap = readOnly ? 'gap-0.5' : 'gap-1';
  return (
    <div className="flex items-center justify-center">
      <div className={`flex ${gap}`}>
        {left.map((n) => (
          <Tooth key={n} num={n} on={selected.includes(n)} readOnly={readOnly} onToggle={onToggle} />
        ))}
      </div>
      {/* 中線 */}
      <div className={`self-stretch mx-1.5 border-l-2 border-gray-400`} />
      <div className={`flex ${gap}`}>
        {right.map((n) => (
          <Tooth key={n} num={n} on={selected.includes(n)} readOnly={readOnly} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

export default function ToothChart({
  selected = [],
  onToggle,
  readOnly = false,
}: {
  selected?: string[];
  onToggle?: (n: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="inline-block">
      {/* 牙醫視角：左=患者右(Q1)、右=患者左(Q2) */}
      <div className="flex justify-between text-[10px] text-gray-400 px-1 mb-0.5">
        <span>右上</span>
        <span>左上</span>
      </div>
      <Row left={UPPER_LEFT} right={UPPER_RIGHT} selected={selected} readOnly={readOnly} onToggle={onToggle} />
      {/* 上下分隔（咬合線） */}
      <div className="border-t-2 border-gray-400 my-1.5" />
      <Row left={LOWER_LEFT} right={LOWER_RIGHT} selected={selected} readOnly={readOnly} onToggle={onToggle} />
      <div className="flex justify-between text-[10px] text-gray-400 px-1 mt-0.5">
        <span>右下</span>
        <span>左下</span>
      </div>
    </div>
  );
}
