'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasTransform, Position } from './boardStore';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_SPEED = 0.1;

export function useCanvasTransform() {
  const [transform, setTransform] = useState<CanvasTransform>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });

  const isDragging = useRef(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      e.preventDefault();

      const delta = e.deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
      const newScale = Math.min(Math.max(transform.scale + delta, MIN_ZOOM), MAX_ZOOM);

      setTransform((prev) => ({
        ...prev,
        scale: newScale,
      }));
    },
    [transform.scale]
  );

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 2 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    setTransform((prev) => ({
      ...prev,
      offsetX: prev.offsetX + deltaX,
      offsetY: prev.offsetY + deltaY,
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const resetZoom = useCallback(() => {
    setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
  }, []);

  const zoom = useCallback((factor: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * factor, MIN_ZOOM), MAX_ZOOM),
    }));
  }, []);

  return {
    transform,
    setTransform,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetZoom,
    zoom,
  };
}

export function canvasToWorld(
  canvasPos: Position,
  transform: CanvasTransform
): Position {
  return {
    x: (canvasPos.x - transform.offsetX) / transform.scale,
    y: (canvasPos.y - transform.offsetY) / transform.scale,
  };
}

export function worldToCanvas(
  worldPos: Position,
  transform: CanvasTransform
): Position {
  return {
    x: worldPos.x * transform.scale + transform.offsetX,
    y: worldPos.y * transform.scale + transform.offsetY,
  };
}
