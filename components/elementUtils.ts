'use client';

import { Element, ElementType, Position, Size, StickyNote, Shape } from './boardStore';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createStickyNote(position: Position): StickyNote {
  return {
    id: generateId(),
    type: 'sticky-note',
    position,
    zIndex: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    content: 'Edit me...',
    color: '#fef3c7',
    size: { width: 200, height: 160 },
  };
}

export function createRectangle(position: Position): Shape {
  return {
    id: generateId(),
    type: 'rectangle',
    position,
    zIndex: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    size: { width: 150, height: 100 },
    stroke: '#3b82f6',
    strokeWidth: 2,
    fill: 'transparent',
  };
}

export function createCircle(position: Position): Shape {
  return {
    id: generateId(),
    type: 'circle',
    position,
    zIndex: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    size: { width: 100, height: 100 },
    stroke: '#ef4444',
    strokeWidth: 2,
    fill: 'transparent',
  };
}

export function createLine(position: Position): Shape {
  return {
    id: generateId(),
    type: 'line',
    position,
    zIndex: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    size: { width: 150, height: 1 },
    stroke: '#10b981',
    strokeWidth: 2,
    fill: 'none',
  };
}

export function isStickyNote(element: Element): element is StickyNote {
  return element.type === 'sticky-note';
}

export function isShape(element: Element): element is Shape {
  return element.type === 'rectangle' || element.type === 'circle' || element.type === 'line';
}

export function getElementBounds(element: Element): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  return {
    x: element.position.x,
    y: element.position.y,
    width: element.size.width,
    height: element.size.height,
  };
}

export function isPointInElement(point: Position, element: Element): boolean {
  const bounds = getElementBounds(element);
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

export const STICKY_NOTE_COLORS = [
  '#fef3c7', // yellow
  '#fecaca', // red
  '#a7f3d0', // green
  '#bfdbfe', // blue
  '#ddd6fe', // purple
  '#f5f3ff', // light purple
];

export const SHAPE_COLORS = {
  rectangle: '#3b82f6',
  circle: '#ef4444',
  line: '#10b981',
};
