import React, { useRef, useEffect } from "react";

const IpodWheel = ({ onScroll = () => {}, onSelect = () => {}, onBack = () => {} }) => {
  const wheelRef = useRef(null);
  const lastAngle = useRef(null);
  const acc = useRef(0);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    const getAngle = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      return Math.atan2(e.clientY - cy, e.clientX - cx);
    };

    const onPointerDown = (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      lastAngle.current = getAngle(e);
      acc.current = 0;
    };

    const onPointerMove = (e) => {
      if (lastAngle.current == null) return;
      const angle = getAngle(e);
      let delta = angle - lastAngle.current;

      // Normalize delta to -PI..PI
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;

      // Small threshold so tiny jitter doesn't scroll
      const THRESH = 0.04; // tuned for good feel
      if (Math.abs(delta) > THRESH) {
        // Positive delta -> clockwise (user moved finger down/right) — we'll treat as 'up' or 'down' depending on convention
        // We'll call onScroll with 'up' when delta < 0 (counter-clockwise), and 'down' when delta > 0
        if (delta > 0) onScroll("down");
        else onScroll("up");

        // accumulate to avoid firing too many times
        acc.current += delta;
        lastAngle.current = angle;
      }
    };

    const onPointerUp = (e) => {
      try { el.releasePointerCapture && el.releasePointerCapture(e.pointerId); } catch (err) {}
      lastAngle.current = null;
      acc.current = 0;
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [wheelRef.current, onScroll]);

  // also provide keyboard accessibility for testing/dev
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") onScroll("up");
      if (e.key === "ArrowDown") onScroll("down");
      if (e.key === "Enter") onSelect();
      if (e.key === "Backspace" || e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onScroll, onSelect, onBack]);

  return (
    <div className="ipod-wheel-root">
      <div className="wheel-outer" ref={wheelRef} style={{ touchAction: "none" }}>
        <div
          className="wheel-center"
          role="button"
          aria-label="Select"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSelect();
          }}
        >
          <div className="wheel-center-label">Select</div>
        </div>
      </div>

      <div className="wheel-mini-row">
        <button
          className="wheel-mini-btn"
          onClick={() => {
            onBack();
          }}
        >
          Menu
        </button>
      </div>
    </div>
  );
};

export default IpodWheel;
