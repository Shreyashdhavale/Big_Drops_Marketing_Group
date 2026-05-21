'use client';

import React from 'react';
import { Shape } from '../boardStore';

interface ShapeElementProps {
  element: Shape;
  isSelected: boolean;
}

export function ShapeElement({ element, isSelected }: ShapeElementProps) {
  const commonProps = {
    x: element.position.x,
    y: element.position.y,
    stroke: element.stroke,
    strokeWidth: element.strokeWidth,
    fill: element.fill,
    style: {
      cursor: 'grab',
      filter: isSelected ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
      transition: 'filter 0.2s',
    },
  };

  if (element.type === 'rectangle') {
    return (
      <rect
        {...commonProps}
        width={element.size.width}
        height={element.size.height}
        rx="4"
        strokeDasharray={isSelected ? '5,5' : ''}
      />
    );
  }

  if (element.type === 'circle') {
    const radius = Math.min(element.size.width, element.size.height) / 2;
    return (
      <circle
        cx={element.position.x + radius}
        cy={element.position.y + radius}
        r={radius}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        fill={element.fill}
        style={{
          cursor: 'grab',
          filter: isSelected ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
          transition: 'filter 0.2s',
        }}
        strokeDasharray={isSelected ? '5,5' : ''}
      />
    );
  }

  if (element.type === 'line') {
    return (
      <line
        x1={element.position.x}
        y1={element.position.y}
        x2={element.position.x + element.size.width}
        y2={element.position.y}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        style={{
          cursor: 'grab',
          filter: isSelected ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
          transition: 'filter 0.2s',
        }}
        strokeDasharray={isSelected ? '5,5' : ''}
      />
    );
  }

  return null;
}
