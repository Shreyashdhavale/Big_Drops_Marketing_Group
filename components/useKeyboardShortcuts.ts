'use client';

import { useEffect } from 'react';
import { useBoardStore } from './boardStore';
import {
  createStickyNote,
  createRectangle,
  createCircle,
  createLine,
} from './elementUtils';

export function useKeyboardShortcuts() {
  const { addElement, deleteElement, selectedElementId } = useBoardStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts if typing in textarea
      if (e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl+N or Cmd+N: Add sticky note
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        addElement(createStickyNote({ x: 100, y: 100 }));
      }

      // R: Add rectangle
      if (e.key.toLowerCase() === 'r' && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addElement(createRectangle({ x: 100, y: 100 }));
      }

      // C: Add circle
      if (e.key.toLowerCase() === 'c' && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addElement(createCircle({ x: 100, y: 100 }));
      }

      // L: Add line
      if (e.key.toLowerCase() === 'l' && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addElement(createLine({ x: 100, y: 100 }));
      }

      // Delete: Delete selected element
      if (e.key === 'Delete' && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
      }

      // Backspace: Delete selected element
      if (e.key === 'Backspace' && selectedElementId) {
        e.preventDefault();
        deleteElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addElement, deleteElement, selectedElementId]);
}
