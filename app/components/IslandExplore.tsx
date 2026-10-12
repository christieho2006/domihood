"use client";

import { useEffect, useState } from "react";
import Island3D from "./Island3D";

type Place = "square" | "cafe" | "cottage";
type Props = { onClose: () => void; onVisit: (place: Place) => void };

export default function IslandExplore({ onClose, onVisit }: Props) {
  const [angle, setAngle] = useState(-8);
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState<"overview" | "garden" | "cottage" | "bridge">("overview");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setAngle(value => Math.max(-160, value - 8));
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setAngle(value => Math.min(160, value + 8));
      if (event.key === "+" || event.key === "=") setZoom(value => Math.min(1.7, value + .08));
      if (event.key === "-" || event.key === "_") setZoom(value => Math.max(.72, value - .08));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function focusOn(area: "overview" | "garden" | "cottage" | "bridge") {
    setFocus(area);
    const presets = {
      overview: { angle: -8, zoom: 1 },
      garden: { angle: -48, zoom: 1.2 },
      cottage: { angle: 36, zoom: 1.35 },
      bridge: { angle: 78, zoom: 1.25 },
    };
    setAngle(presets[area].angle);
    setZoom(presets[area].zoom);
  }

  return <div className="island-explore" role="dialog" aria-modal="true" aria-label="沉浸式小岛探索">
    <div className="explore-world-canvas">
      <Island3D angle={angle} zoom={zoom} />
    </div>
    <div className="explore-vignette" />
    <header className="explore-topbar">
      <button className="explore-back" onClick={onClose} aria-label="返回主页">← <span>返回主页</span></button>
      <div className="explore-title"><span>DOMIHOOD · OPEN WORLD</span><strong>云端小岛</strong><small>与首页同一座小岛，换个视角继续探索</small></div>
      <div className="explore-status"><i /> 世界已载入</div>
    </header>
    <div className="explore-hint"><span>✧</span> 拖动旋转视角 <i /> 使用 + / − 缩放 <i /> ESC 返回</div>
    <nav className="explore-viewpoints" aria-label="小岛观景点">
      <button className={focus==="overview"?"active":""} onClick={()=>focusOn("overview")}>全岛</button>
      <button className={focus==="garden"?"active":""} onClick={()=>focusOn("garden")}>花园视角</button>
      <button className={focus==="bridge"?"active":""} onClick={()=>focusOn("bridge")}>小桥视角</button>
      <button className={focus==="cottage"?"active":""} onClick={()=>focusOn("cottage")}>小屋视角</button>
    </nav>
    <div className="explore-actions">
      <button onClick={()=>setZoom(value=>Math.max(.72,value-.1))} aria-label="缩小">−</button>
      <span>{Math.round(zoom*100)}%</span>
      <button onClick={()=>setZoom(value=>Math.min(1.7,value+.1))} aria-label="放大">＋</button>
      <button onClick={()=>onVisit("square")}>粉丝广场 ↗</button>
      <button onClick={()=>onVisit("cafe")}>回忆咖啡馆 ↗</button>
      <button onClick={()=>onVisit("cottage")}>私人小屋 ↗</button>
    </div>
  </div>;
}
