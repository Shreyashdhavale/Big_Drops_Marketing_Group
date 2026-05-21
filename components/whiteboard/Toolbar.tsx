'use client';

import React, { useState } from 'react';
import { Plus, Square, Circle, Minus, Trash2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useBoardStore } from '../boardStore';
import { createStickyNote, createRectangle, createCircle, createLine } from '../elementUtils';

interface ToolbarProps {
  onResetZoom: () => void;
}

export function Toolbar({ onResetZoom }: ToolbarProps) {
  const { addElement, deleteElement, clearBoard, selectedElementId, setCanvasTransform, canvasTransform } = useBoardStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Helper to spawn elements at canvas center instead of world (0,0)
  const spawnAtCenter = (creator: (pos: { x: number; y: number }) => any) => {
    // Calculate center of visible canvas (convert screen center to world coordinates)
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    
    // Convert screen coordinates to world coordinates
    const worldX = (screenCenterX - canvasTransform.offsetX) / canvasTransform.scale;
    const worldY = (screenCenterY - canvasTransform.offsetY) / canvasTransform.scale;
    
    addElement(creator({ x: worldX, y: worldY }));
  };

  const handleAddNote = () => {
    spawnAtCenter(createStickyNote);
  };

  const handleAddRectangle = () => {
    spawnAtCenter(createRectangle);
  };

  const handleAddCircle = () => {
    spawnAtCenter(createCircle);
  };

  const handleAddLine = () => {
    spawnAtCenter(createLine);
  };

  const handleDeleteSelected = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  const handleClearBoard = () => {
    if (showClearConfirm) {
      clearBoard();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleZoomIn = () => {
    const newScale = Math.min(canvasTransform.scale * 1.2, 5);
    setCanvasTransform({ ...canvasTransform, scale: newScale });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(canvasTransform.scale / 1.2, 0.1);
    setCanvasTransform({ ...canvasTransform, scale: newScale });
  };

  return (
    <div className="bg-white border-b border-slate-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 shadow-sm overflow-x-auto">
      {/* Add elements section */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <button
          onClick={handleAddNote}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Add sticky note (Ctrl+N)"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        </button>

        <button
          onClick={handleAddRectangle}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Add rectangle (R)"
        >
          <Square className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </button>

        <button
          onClick={handleAddCircle}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Add circle (C)"
        >
          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
        </button>

        <button
          onClick={handleAddLine}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Add line (L)"
        >
          <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </button>
      </div>

      {/* Separator - hide on very small screens */}
      <div className="w-px h-5 bg-slate-200 hidden sm:block flex-shrink-0" />

      {/* Zoom section */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <button
          onClick={handleZoomIn}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        </button>

        <button
          onClick={onResetZoom}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset zoom"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        </button>
      </div>

      {/* Separator - hide on very small screens */}
      <div className="w-px h-5 bg-slate-200 hidden sm:block flex-shrink-0" />

      {/* Delete section */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
        <button
          onClick={handleDeleteSelected}
          disabled={!selectedElementId}
          className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete selected (Del)"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
        </button>

        <button
          onClick={handleClearBoard}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex-shrink-0 ${
            showClearConfirm
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          title="Clear all elements"
        >
          {showClearConfirm ? 'Confirm' : 'Clear'}
        </button>
      </div>

      {/* Flex spacer */}
      <div className="flex-1" />

      {/* Info section - hide on very small screens, show on tablet+ */}
      <div className="text-xs hidden md:block text-slate-500 font-mono flex-shrink-0 whitespace-nowrap">
        Zoom: {(canvasTransform.scale * 100).toFixed(0)}%
      </div>
    </div>
  );
}
