'use client';

import { useEffect, useState } from 'react';
import { persistenceManager } from './persistenceStore';
import { CanvasTransform, Element } from './boardStore';

interface BoardData {
  elements: Element[];
  transform: CanvasTransform;
}

export function usePersistence() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    persistenceManager.init().then(() => setIsReady(true));
  }, []);

  const save = async (data: BoardData) => {
    if (!isReady) return;
    try {
      await persistenceManager.saveBoard(data);
    } catch (error) {
      console.error('Failed to save board:', error);
    }
  };

  const load = async () => {
    if (!isReady) return null;
    try {
      return await persistenceManager.loadBoard();
    } catch (error) {
      console.error('Failed to load board:', error);
      return null;
    }
  };

  const clear = async () => {
    if (!isReady) return;
    try {
      await persistenceManager.clearBoard();
    } catch (error) {
      console.error('Failed to clear board:', error);
    }
  };

  return { save, load, clear, isReady };
}
