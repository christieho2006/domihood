"use client";

type Props = {
  angle: number;
  zoom: number;
  onEnter?: () => void;
  onAngleChange?: (angle: number) => void;
  onRegionSelect?: (region: { n: number; name: string }) => void;
  freeRotate?: boolean;
};

// Coordinates are aligned to the original island artwork in WechatIMG822.png.
// The visual itself stays a single, untouched image; these hit areas are independent.
const regions = [
  { n: 1, name: "主屋", x: 198, y: 192 },
  { n: 2, name: "山顶瀑布", x: 675, y: 99 },
  { n: 3, name: "花园茶屋", x: 327, y: 336 },
  { n: 4, name: "中央广场", x: 477, y: 363 },
  { n: 5, name: "咖啡馆", x: 685, y: 365 },
  { n: 6, name: "田园农场", x: 80, y: 399 },
  { n: 7, name: "观景塔", x: 436, y: 449 },
  { n: 8, name: "河畔码头", x: 610, y: 433 },
  { n: 9, name: "神秘森林", x: 309, y: 631 },
  { n: 10, name: "温泉庭院", x: 260, y: 578 },
  { n: 11, name: "隐秘洞穴", x: 840, y: 154 },
  { n: 12, name: "商业街", x: 464, y: 612 },
  { n: 13, name: "梦幻湖泊", x: 893, y: 489 },
  { n: 14, name: "果树乐园", x: 773, y: 647 },
  { n: 15, name: "气球台", x: 882, y: 566 },
];

export default function Island2D({ angle, zoom, onEnter, onAngleChange, onRegionSelect, freeRotate = false }: Props) {
  const safeZoom = Math.max(.72, Math.min(1.7, zoom));
  return (
    <svg
      className="island-art island-3d-canvas island-2d-scene"
      viewBox="0 0 970 823"
      role="group"
      aria-label="DOMIHOOD 完整手绘小岛，包含十五个可探索区域"
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(485 411.5) scale(${safeZoom}) rotate(${freeRotate ? angle * .12 : 0}) translate(-485 -411.5)`}>
        <image href="/images/WechatIMG822.png" x="0" y="0" width="1308" height="1202" preserveAspectRatio="none" />
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
            <circle r="39" fill="#172d48" opacity="0" />
            <circle r="18" fill="transparent" stroke="transparent" strokeWidth="2" />
            <title>{region.name} · 点击探索</title>
          </g>
        ))}
      </g>
    </svg>
  );
}
