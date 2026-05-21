# Interactive Collaborative Whiteboard

A modern, interactive whiteboard application built with Next.js where users can create sticky notes, add shapes, drag/pan/zoom the canvas, and experience simulated real-time collaboration.

## Features

### Core Functionality
- 🎨 **Sticky Notes**: Create, edit, delete, and recolor sticky notes with timestamps
- 📐 **Shapes**: Add rectangles, circles, and lines to the canvas
- 🎯 **Selection & Dragging**: Click to select, drag to reposition all elements
- 🔍 **Pan & Zoom**: Smooth panning and zooming with mouse wheel (Ctrl+Scroll)
- 💾 **Persistence**: Auto-save board state to IndexedDB with automatic restore on refresh
- 👥 **Simulated Collaboration**: Show fake online users with presence indicators
- ⌨️ **Keyboard Shortcuts**: Quick actions with keyboard (Ctrl+N for note, R/C/L for shapes, Delete to remove)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Next.js 15** (App Router)
- **React 19 / TypeScript**
- **Tailwind CSS 4**
- **Zustand** for state management
- **IndexedDB** for persistence
- **SVG** for canvas rendering

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
components/
├── whiteboard/
│   ├── Canvas.tsx              # Main canvas component
│   ├── Toolbar.tsx             # Top toolbar with controls
│   ├── StickyNote.tsx          # Sticky note component
│   ├── ShapeElement.tsx        # Shape rendering
│   └── UserPresence.tsx        # Collaboration indicator
├── boardStore.ts               # Zustand state management
├── persistenceStore.ts         # IndexedDB persistence
├── elementUtils.ts             # Utility functions
├── useCanvasTransform.ts       # Pan/zoom hook
├── usePersistence.ts           # Persistence hook
└── useKeyboardShortcuts.ts     # Keyboard handler
app/
├── page.tsx
├── layout.tsx
└── globals.css
```

## Architecture

**State Management**: Centralized Zustand store for all board state (elements, transform, selection)

**Persistence**: IndexedDB with 1-second auto-save debounce

**Canvas Rendering**: SVG with hierarchical transforms for efficient pan/zoom

**Interactions**: Click-to-select, drag-to-move, Ctrl+Scroll to zoom

## Usage

- **Add Note**: `Ctrl+N` or click +
- **Add Shapes**: Press `R` (rectangle), `C` (circle), `L` (line)
- **Edit Note**: Double-click to edit, click color dot to change color
- **Move**: Click and drag any element
- **Delete**: Select and press `Delete`
- **Zoom**: `Ctrl+Scroll` or toolbar buttons
- **Pan**: Middle-click drag or `Ctrl+Click` drag

## Performance Optimizations

- Memoized components
- Debounced auto-save
- SVG transforms for efficient rendering
- Event delegation on canvas
- Sorted Z-index only on changes

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires IndexedDB

## Deployment

```bash
# Vercel (recommended)
vercel

# or Netlify
npm run build
```

## Tradeoffs

- **No real-time sync**: Simulated collaboration (MVP, no backend)
- **Local browser storage**: No account system
- **SVG over Canvas**: Better interactivity, slightly less performance
- **Zustand over Context**: Simpler, less flexible
- **IndexedDB**: Requires modern browser, graceful fallback

## Challenges Solved

1. SVG coordinate transforms → `canvasToWorld`/`worldToCanvas` utilities
2. Editing in SVG → `foreignObject` with HTML content
3. Drag precision → Offset tracking between mouse and element
4. Performance → Group-level transforms, debounced saves
5. Persistence timing → Debounced IndexedDB writes

## Future Features

- [ ] Undo/Redo
- [ ] Multi-select
- [ ] Resize handles
- [ ] Export as image
- [ ] Minimap
- [ ] Snap-to-grid
- [ ] Dark mode
- [ ] Touch gestures
- [ ] Real-time WebSocket collaboration
