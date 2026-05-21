'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBoardStore } from '../boardStore';
import { useCanvasTransform, canvasToWorld, worldToCanvas } from '../useCanvasTransform';
import { usePersistence } from '../usePersistence';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';
import { StickyNote } from './StickyNote';
import { ShapeElement } from './ShapeElement';
import { Toolbar } from './Toolbar';
import { UserPresence } from './UserPresence';
import { ActivityFeed } from './ActivityFeed';
import { ActivityToggle } from './ActivityToggle';

export function Canvas() {
  const {
    elements: storeElements,
    canvasTransform,
    selectedElementId,
    updateElement,
    selectElement,
    setCanvasTransform,
    getBoardData,
    setBoardData,
  } = useBoardStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { transform, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, resetZoom } =
    useCanvasTransform();
  const { save, load, isReady } = usePersistence();
  
  useKeyboardShortcuts();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);

  // Load persisted board on mount
  useEffect(() => {
    if (!isReady) return;

    const loadBoard = async () => {
      const savedData = await load();
      if (savedData) {
        setBoardData(savedData);
        setCanvasTransform(savedData.transform);
      }
    };

    loadBoard();
    // Intentionally not including deps to load once on ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // Auto-save when board changes
  useEffect(() => {
    if (!isReady) return;

    const debounceTimer = setTimeout(() => {
      const data = getBoardData();
      save(data);
    }, 1000);

    return () => clearTimeout(debounceTimer);
    // Intentionally not including all deps to avoid constant resaves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeElements, canvasTransform, isReady]);

  // Sync Zustand transform with local hook transform
  useEffect(() => {
    setCanvasTransform(transform);
    // Intentionally minimal deps for transform sync
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transform]);

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    container.addEventListener('wheel', handleWheel as EventListener, { passive: false });
    container.addEventListener('mousedown', handleMouseDown as EventListener);
    window.addEventListener('mousemove', handleMouseMove as EventListener);
    window.addEventListener('mouseup', handleMouseUp as EventListener);
    container.addEventListener('contextmenu', handleContextMenu);

    return () => {
      container.removeEventListener('wheel', handleWheel as EventListener);
      container.removeEventListener('mousedown', handleMouseDown as EventListener);
      window.removeEventListener('mousemove', handleMouseMove as EventListener);
      window.removeEventListener('mouseup', handleMouseUp as EventListener);
      container.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    selectElement(elementId);
    setDraggedElementId(elementId);
    setIsDragging(true);

    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const element = storeElements.get(elementId);
      if (element) {
        const canvasPos = worldToCanvas(element.position, canvasTransform);
        setDragOffset({
          x: e.clientX - rect.left - canvasPos.x,
          y: e.clientY - rect.top - canvasPos.y,
        });
      }
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !draggedElementId) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = e.clientX - rect.left - dragOffset.x;
    const canvasY = e.clientY - rect.top - dragOffset.y;
    const worldPos = canvasToWorld({ x: canvasX, y: canvasY }, canvasTransform);

    updateElement(draggedElementId, { position: worldPos });
  };

  const handleMouseUpCanvas = () => {
    setIsDragging(false);
    setDraggedElementId(null);
  };

  // Touch event handlers for mobile/tablet
  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging || !draggedElementId) return;
    if (e.touches.length !== 1) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const canvasX = touch.clientX - rect.left - dragOffset.x;
    const canvasY = touch.clientY - rect.top - dragOffset.y;
    const worldPos = canvasToWorld({ x: canvasX, y: canvasY }, canvasTransform);

    updateElement(draggedElementId, { position: worldPos });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDraggedElementId(null);
  };

  const elements = Array.from(storeElements.values()).sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Toolbar onResetZoom={resetZoom} />

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-white"
        style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          onMouseLeave={handleMouseUpCanvas}
          onTouchMove={handleTouchMove as React.TouchEventHandler<SVGSVGElement>}
          onTouchEnd={handleTouchEnd}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* Grid background */}
          <g
            style={{
              transform: `translate(${canvasTransform.offsetX}px, ${canvasTransform.offsetY}px) scale(${canvasTransform.scale})`,
              transformOrigin: '0 0',
            }}
          >
            <rect width="10000" height="10000" fill="url(#grid)" x="-5000" y="-5000" />
          </g>

          {/* Elements */}
          <g
            style={{
              transform: `translate(${canvasTransform.offsetX}px, ${canvasTransform.offsetY}px) scale(${canvasTransform.scale})`,
              transformOrigin: '0 0',
              pointerEvents: 'auto',
            }}
          >
            {elements.map((element) => (
              <g key={element.id} onMouseDown={(e) => handleElementMouseDown(e, element.id)}>
                {element.type === 'sticky-note' && (
                  <StickyNote element={element as React.ComponentProps<typeof StickyNote>['element']} isSelected={selectedElementId === element.id} />
                )}
                {(element.type === 'rectangle' || element.type === 'circle' || element.type === 'line') && (
                  <ShapeElement element={element as React.ComponentProps<typeof ShapeElement>['element']} isSelected={selectedElementId === element.id} />
                )}
              </g>
            ))}
          </g>
        </svg>

        {/* Position user presence and activity feed responsively */}
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 pointer-events-none">
          <UserPresence />
        </div>
        
        {/* Activity Feed - visible only on desktop */}
        <div className="absolute top-20 md:top-24 right-4 md:right-8 pointer-events-auto hidden md:block">
          <ActivityFeed />
        </div>

        {/* Activity Toggle button - visible only on mobile/tablet */}
        <ActivityToggle />
      </div>
    </div>
  );
}

