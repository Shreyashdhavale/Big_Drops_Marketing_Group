'use client';

import React, { useState, useRef, useEffect } from 'react';
import { StickyNote as StickyNoteType } from '../boardStore';
import { STICKY_NOTE_COLORS } from '../elementUtils';
import { useBoardStore } from '../boardStore';

interface StickyNoteProps {
  element: StickyNoteType;
  isSelected: boolean;
}

export function StickyNote({ element, isSelected }: StickyNoteProps) {
  const { updateElement } = useBoardStore();
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [content, setContent] = useState(element.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (isEditingLocal && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditingLocal]);

  const handleDoubleClick = () => {
    setIsEditingLocal(true);
  };

  const handleBlur = () => {
    if (content.trim()) {
      updateElement(element.id, { content });
    }
    setIsEditingLocal(false);
  };

  const handleColorChange = (color: string) => {
    updateElement(element.id, { color });
    setShowColorPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleBlur();
    }
  };

  return (
    <foreignObject
      x={element.position.x}
      y={element.position.y}
      width={element.size.width}
      height={element.size.height}
    >
      <div
        className={`h-full w-full flex flex-col p-3 rounded-lg transition-all pointer-events-auto ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md hover:shadow-lg'
        }`}
        style={{
          backgroundColor: element.color,
          userSelect: 'none',
          border: isSelected ? '2px solid #3b82f6' : 'none',
          boxSizing: 'border-box',
        }}
      >
        {isEditingLocal ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 w-full bg-transparent resize-none focus:outline-none text-sm text-slate-800 placeholder-slate-400 pointer-events-auto"
            placeholder="Your note here..."
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="flex-1 w-full text-sm text-slate-800 leading-tight overflow-hidden text-ellipsis cursor-text whitespace-pre-wrap break-words"
            onDoubleClick={handleDoubleClick}
          >
            {element.content || 'Double-click to edit...'}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-black/10">
          <span className="text-xs text-slate-600 truncate">
            {new Date(element.updatedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
              className="w-5 h-5 rounded border border-black/20 hover:border-black/40 transition-colors pointer-events-auto"
              style={{ backgroundColor: element.color }}
              title="Change color"
            />

            {showColorPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-2 flex gap-1 z-50">
                {STICKY_NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-5 h-5 rounded border-2 border-slate-300 hover:border-slate-400 transition-colors pointer-events-auto"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </foreignObject>
  );
}

