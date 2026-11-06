"use client";

type Props = {
  angle: number;
  zoom: number;
  onEnter?: () => void;
  onAngleChange?: (angle: number) => void;
  onRegionSelect?: (region: { n: number; name: string }) => void;
  freeRotate?: boolean;
};

const regions = [
  {
    "n": 1,
    "name": "主屋",
    "x": 515,
    "y": 285
  },
  {
    "n": 2,
    "name": "山顶瀑布",
    "x": 865,
    "y": 210
  },
  {
    "n": 3,
    "name": "花园茶屋",
    "x": 320,
    "y": 530
  },
  {
    "n": 4,
    "name": "中央广场",
    "x": 555,
    "y": 450
  },
  {
    "n": 5,
    "name": "咖啡馆",
    "x": 850,
    "y": 620
  },
  {
    "n": 6,
    "name": "田园农场",
    "x": 250,
    "y": 580
  },
  {
    "n": 7,
    "name": "观景塔",
    "x": 750,
    "y": 300
  },
  {
    "n": 8,
    "name": "河畔码头",
    "x": 735,
    "y": 565
  },
  {
    "n": 9,
    "name": "神秘森林",
    "x": 220,
    "y": 350
  },
  {
    "n": 10,
    "name": "温泉庭院",
    "x": 915,
    "y": 540
  },
  {
    "n": 11,
    "name": "隐秘洞穴",
    "x": 945,
    "y": 455
  },
  {
    "n": 12,
    "name": "商业街",
    "x": 500,
    "y": 700
  },
  {
    "n": 13,
    "name": "梦幻湖泊",
    "x": 760,
    "y": 430
  },
  {
    "n": 14,
    "name": "果树乐园",
    "x": 1000,
    "y": 680
  },
  {
    "n": 15,
    "name": "气球台",
    "x": 620,
    "y": 760
  }
];

export default function Island2D({ angle, zoom, onEnter, onAngleChange, onRegionSelect, freeRotate = false }: Props) {
  const safeZoom = Math.max(.72, Math.min(1.7, zoom));
  return (
    <svg
      className="island-art island-3d-canvas island-2d-scene"
      viewBox="0 0 1200 900"
      role="group"
      aria-label="DOMIHOOD 手绘浮空小岛，包含十五个可探索区域"
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(600 450) scale(${safeZoom}) rotate(${freeRotate ? angle * .12 : 0}) translate(-600 -450)`}>
        <image href="/images/domihood-island-scene.svg" x="0" y="0" width="1200" height="900" preserveAspectRatio="xMidYMid meet" />
        {regions.map((region) => (
          <g
            key={region.n}
            role="button"
            tabIndex={0}
            aria-label={`进入${region.name}`}
            className="island-region-hotspot"
            transform={`translate(${region.x} ${region.y})`}
            onClick={(event) => { event.stopPropagation(); onRegionSelect ? onRegionSelect(region) : onEnter?.(); }}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); onRegionSelect ? onRegionSelect(region) : onEnter?.(); } }}
            style={{ cursor: "pointer" }}
          >
            <circle r="34" fill="#172d48" opacity="0" />
            <circle r="12" fill="#f5e5c7" stroke="#66534b" strokeWidth="2.5" />
            <text y="4" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4f4140">{region.n}</text>
            <title>{region.name} · 点击探索</title>
          </g>
        ))}
        <path d="M600 105C820 105 1020 205 1060 380s-35 295-160 370q-145 80-300 45Q420 820 250 720 105 620 120 435 120 255 285 165 420 95 600 105Z" fill="none" stroke="#e5d0a8" strokeWidth="5" strokeDasharray="2 15" strokeLinecap="round" opacity=".65" />
      </g>
    </svg>
  );
}
