'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ElementType = 'sticky-note' | 'rectangle' | 'circle' | 'line';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  zIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface StickyNote extends BaseElement {
  type: 'sticky-note';
  content: string;
  color: string;
  size: Size;
}

export interface Shape extends BaseElement {
  type: 'rectangle' | 'circle' | 'line';
  size: Size;
  stroke: string;
  strokeWidth: number;
  fill: string;
}

export type Element = StickyNote | Shape;

export interface CanvasTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface BoardState {
  elements: Map<string, Element>;
  canvasTransform: CanvasTransform;
  selectedElementId: string | null;
  isEditing: boolean;
  lastZIndex: number;

  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  clearBoard: () => void;
  selectElement: (id: string | null) => void;
  setEditing: (isEditing: boolean) => void;
  setCanvasTransform: (transform: CanvasTransform) => void;
  getNextZIndex: () => number;
  getElement: (id: string) => Element | undefined;
  getAllElements: () => Element[];
  getBoardData: () => { elements: Element[]; transform: CanvasTransform };
  setBoardData: (data: { elements: Element[]; transform: CanvasTransform }) => void;
}

export const useBoardStore = create<BoardState>()(
  devtools(
    (set, get) => ({
      elements: new Map(),
      canvasTransform: { scale: 1, offsetX: 0, offsetY: 0 },
      selectedElementId: null,
      isEditing: false,
      lastZIndex: 0,

      addElement: (element) =>
        set((state) => {
          const newElements = new Map(state.elements);
          newElements.set(element.id, { ...element, zIndex: state.lastZIndex + 1 });
          return {
            elements: newElements,
            lastZIndex: state.lastZIndex + 1,
          };
        }),

      updateElement: (id, updates) =>
        set((state) => {
          const element = state.elements.get(id);
          if (!element) return state;
          const newElements = new Map(state.elements);
          newElements.set(id, {
            ...element,
            ...updates,
            updatedAt: Date.now(),
          } as Element);
          return { elements: newElements };
        }),

      deleteElement: (id) =>
        set((state) => {
          const newElements = new Map(state.elements);
          newElements.delete(id);
          return {
            elements: newElements,
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
          };
        }),

      clearBoard: () =>
        set(() => ({
          elements: new Map(),
          selectedElementId: null,
          lastZIndex: 0,
        })),

      selectElement: (id) =>
        set({
          selectedElementId: id,
          isEditing: false,
        }),

      setEditing: (isEditing) =>
        set({ isEditing }),

      setCanvasTransform: (transform) =>
        set({ canvasTransform: transform }),

      getNextZIndex: () => {
        const state = get();
        return state.lastZIndex + 1;
      },

      getElement: (id) => {
        const state = get();
        return state.elements.get(id);
      },

      getAllElements: () => {
        const state = get();
        return Array.from(state.elements.values()).sort((a, b) => a.zIndex - b.zIndex);
      },

      getBoardData: () => {
        const state = get();
        return {
          elements: Array.from(state.elements.values()),
          transform: state.canvasTransform,
        };
      },

      setBoardData: (data) =>
        set(() => {
          const elementsMap = new Map<string, Element>();
          let maxZIndex = 0;
          
          data.elements.forEach((el) => {
            elementsMap.set(el.id, el);
            maxZIndex = Math.max(maxZIndex, el.zIndex);
          });

          return {
            elements: elementsMap,
            canvasTransform: data.transform,
            lastZIndex: maxZIndex,
          };
        }),
    }),
    { name: 'BoardStore' }
  )
);
