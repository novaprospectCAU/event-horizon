/**
 * MapView - 2D star map with pan/zoom and draggable minimap.
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import type { Entity } from '@event-horizon/types';

export interface MapViewProps {
  systems: readonly Entity[];
  selectedSystemId?: string | null;
  onSelectSystem?: (systemId: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MapView: React.FC<MapViewProps> = ({
  systems,
  selectedSystemId,
  onSelectSystem,
  width = 600,
  height = 400,
  className,
}) => {
  const padding = 40;

  // World-space coordinates
  const coords = useMemo(() => {
    const raw = systems.map((sys) => {
      const starSystem = sys.components['star-system'];
      const rawCoords = starSystem?.values?.['coordinates'] as
        | { x: number; y: number }
        | undefined;
      return { entity: sys, x: rawCoords?.x ?? 0, y: rawCoords?.y ?? 0 };
    });

    const minX = Math.min(...raw.map((c) => c.x));
    const maxX = Math.max(...raw.map((c) => c.x));
    const minY = Math.min(...raw.map((c) => c.y));
    const maxY = Math.max(...raw.map((c) => c.y));
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    return raw.map((c) => ({
      entity: c.entity,
      sx: padding + ((c.x - minX) / rangeX) * (width - padding * 2),
      sy: padding + ((c.y - minY) / rangeY) * (height - padding * 2),
    }));
  }, [systems, width, height, padding]);

  // Full world viewBox
  const fullVB: ViewBox = useMemo(
    () => ({ x: 0, y: 0, w: width, h: height }),
    [width, height],
  );

  // Current viewBox state (pan/zoom)
  const [viewBox, setViewBox] = useState<ViewBox>(fullVB);

  // Drag state for main map
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; startVB: ViewBox } | null>(null);

  // Minimap drag state
  const minimapRef = useRef<SVGSVGElement>(null);
  const miniDragRef = useRef<boolean>(false);

  const MIN_ZOOM = 0.3; // viewBox can be 30% of full = zoomed in a lot
  const MAX_ZOOM = 1.0; // 100% = full view

  const clampViewBox = useCallback(
    (vb: ViewBox): ViewBox => {
      const w = Math.max(fullVB.w * MIN_ZOOM, Math.min(fullVB.w * MAX_ZOOM, vb.w));
      const h = Math.max(fullVB.h * MIN_ZOOM, Math.min(fullVB.h * MAX_ZOOM, vb.h));
      // Allow panning with some overflow
      const overflowX = w * 0.1;
      const overflowY = h * 0.1;
      const x = Math.max(-overflowX, Math.min(fullVB.w - w + overflowX, vb.x));
      const y = Math.max(-overflowY, Math.min(fullVB.h - h + overflowY, vb.y));
      return { x, y, w, h };
    },
    [fullVB],
  );

  // --- Main map: drag to pan ---
  const onMapPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const svg = svgRef.current;
      if (!svg) return;
      svg.setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startY: e.clientY, startVB: viewBox };
    },
    [viewBox],
  );

  const onMapPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      // Convert pixel delta to viewBox delta
      const scaleX = drag.startVB.w / rect.width;
      const scaleY = drag.startVB.h / rect.height;
      setViewBox(
        clampViewBox({
          x: drag.startVB.x - dx * scaleX,
          y: drag.startVB.y - dy * scaleY,
          w: drag.startVB.w,
          h: drag.startVB.h,
        }),
      );
    },
    [clampViewBox],
  );

  const onMapPointerUp = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (svg) svg.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  }, []);

  // --- Main map: scroll to zoom ---
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      // Mouse position in viewBox coords
      const mx = viewBox.x + ((e.clientX - rect.left) / rect.width) * viewBox.w;
      const my = viewBox.y + ((e.clientY - rect.top) / rect.height) * viewBox.h;

      const zoomFactor = e.deltaY > 0 ? 1.12 : 1 / 1.12;
      const newW = viewBox.w * zoomFactor;
      const newH = viewBox.h * zoomFactor;
      // Zoom towards mouse position
      const newX = mx - (mx - viewBox.x) * (newW / viewBox.w);
      const newY = my - (my - viewBox.y) * (newH / viewBox.h);

      setViewBox(clampViewBox({ x: newX, y: newY, w: newW, h: newH }));
    },
    [viewBox, clampViewBox],
  );

  // --- Minimap interaction ---
  const minimapW = 120;
  const minimapH = Math.round((height / width) * minimapW);

  const moveViewBoxToMinimap = useCallback(
    (clientX: number, clientY: number) => {
      const mini = minimapRef.current;
      if (!mini) return;
      const rect = mini.getBoundingClientRect();
      const mx = ((clientX - rect.left) / rect.width) * fullVB.w;
      const my = ((clientY - rect.top) / rect.height) * fullVB.h;
      setViewBox((prev) =>
        clampViewBox({ x: mx - prev.w / 2, y: my - prev.h / 2, w: prev.w, h: prev.h }),
      );
    },
    [fullVB, clampViewBox],
  );

  const onMiniPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      const mini = minimapRef.current;
      if (!mini) return;
      mini.setPointerCapture(e.pointerId);
      miniDragRef.current = true;
      moveViewBoxToMinimap(e.clientX, e.clientY);
    },
    [moveViewBoxToMinimap],
  );

  const onMiniPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!miniDragRef.current) return;
      moveViewBoxToMinimap(e.clientX, e.clientY);
    },
    [moveViewBoxToMinimap],
  );

  const onMiniPointerUp = useCallback((e: React.PointerEvent) => {
    const mini = minimapRef.current;
    if (mini) mini.releasePointerCapture(e.pointerId);
    miniDragRef.current = false;
  }, []);

  // Reset zoom
  const onResetZoom = useCallback(() => {
    setViewBox(fullVB);
  }, [fullVB]);

  const isZoomed = viewBox.w < fullVB.w * 0.98;

  function getSystemColor(entity: Entity): string {
    const controllerId = entity.components['star-system']?.values?.['controllerId'] as string;
    if (!controllerId) return '#888';
    if (controllerId.includes('terran')) return '#3B82F6';
    if (controllerId.includes('kethari')) return '#EF4444';
    if (controllerId.includes('synthesis')) return '#8B5CF6';
    return '#888';
  }

  // Whether a click was really a click (not a drag)
  const clickOrigin = useRef<{ x: number; y: number } | null>(null);

  const onSystemPointerDown = useCallback((e: React.PointerEvent) => {
    clickOrigin.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onSystemClick = useCallback(
    (e: React.MouseEvent, systemId: string) => {
      if (clickOrigin.current) {
        const dx = Math.abs(e.clientX - clickOrigin.current.x);
        const dy = Math.abs(e.clientY - clickOrigin.current.y);
        if (dx > 4 || dy > 4) return; // was a drag, not a click
      }
      onSelectSystem?.(systemId);
    },
    [onSelectSystem],
  );

  return (
    <div className={`map-view-container ${className ?? ''}`} style={{ position: 'relative' }}>
      {/* Main map */}
      <svg
        ref={svgRef}
        className="map-view"
        width={width}
        height={height}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        style={{ background: '#0a0a1a', borderRadius: '8px', cursor: dragRef.current ? 'grabbing' : 'grab' }}
        onPointerDown={onMapPointerDown}
        onPointerMove={onMapPointerMove}
        onPointerUp={onMapPointerUp}
        onPointerLeave={onMapPointerUp}
        onWheel={onWheel}
      >
        {coords.map(({ entity, sx, sy }) => {
          const color = getSystemColor(entity);
          const isSelected = entity.id === selectedSystemId;
          const contested = entity.components['star-system']?.values?.['contested'] as boolean;

          return (
            <g
              key={entity.id}
              onPointerDown={onSystemPointerDown}
              onClick={(e) => onSystemClick(e, entity.id)}
              style={{ cursor: 'pointer' }}
            >
              {isSelected && (
                <circle cx={sx} cy={sy} r={16} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
              )}
              {contested && (
                <circle cx={sx} cy={sy} r={12} fill="none" stroke="#EAB308" strokeWidth={1} strokeDasharray="3,3" />
              )}
              <circle cx={sx} cy={sy} r={6} fill={color} />
              <text x={sx} y={sy + 18} textAnchor="middle" fill="#ccc" fontSize={10}>
                {entity.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Minimap */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          border: '1px solid #30363d',
          borderRadius: 4,
          overflow: 'hidden',
          background: '#0a0a1a',
          opacity: isZoomed ? 1 : 0.4,
          transition: 'opacity 0.2s',
        }}
      >
        <svg
          ref={minimapRef}
          width={minimapW}
          height={minimapH}
          viewBox={`0 0 ${fullVB.w} ${fullVB.h}`}
          style={{ display: 'block', cursor: 'crosshair' }}
          onPointerDown={onMiniPointerDown}
          onPointerMove={onMiniPointerMove}
          onPointerUp={onMiniPointerUp}
          onPointerLeave={onMiniPointerUp}
        >
          {coords.map(({ entity, sx, sy }) => (
            <circle key={entity.id} cx={sx} cy={sy} r={4} fill={getSystemColor(entity)} />
          ))}
        </svg>
      </div>

      {/* Reset zoom button */}
      {isZoomed && (
        <button
          onClick={onResetZoom}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#21262d',
            border: '1px solid #30363d',
            borderRadius: 4,
            color: '#8b949e',
            fontSize: 11,
            padding: '3px 8px',
            cursor: 'pointer',
          }}
        >
          전체 보기
        </button>
      )}
    </div>
  );
};
