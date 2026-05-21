# 🟨 How to Use Sticky Notes

## Creating Sticky Notes

### Method 1: Toolbar Button (Easiest)
1. Look at the top toolbar
2. Click the **"+"** button (first button on the left)
3. A yellow sticky note appears in the canvas

### Method 2: Keyboard Shortcut (Fastest)
1. Press **`Ctrl+N`** (Windows/Linux) or **`Cmd+N`** (Mac)
2. A sticky note is created instantly

### Method 3: Programmatically (For developers)
```typescript
import { useBoardStore } from '@/components/boardStore';
import { createStickyNote } from '@/components/elementUtils';

const { addElement } = useBoardStore();
addElement(createStickyNote({ x: 100, y: 100 }));
```

---

## Editing Sticky Notes

### Edit Text
1. **Double-click** on the sticky note text
2. Text becomes editable
3. Type your content
4. Click outside or press **`Escape`** to save

### Change Color
1. Click on the **colored dot** in the bottom-right of the note
2. A color picker appears
3. Choose from 6 preset colors:
   - 🟨 Yellow
   - 🟥 Red
   - 🟩 Green
   - 🟦 Blue
   - 🟪 Purple
   - ⬜ Light Purple

---

## Working with Sticky Notes

### Move a Note
1. Click anywhere on the note to select it (shows blue outline)
2. Drag it to a new position
3. Release to place it

### Delete a Note
1. Click to select the note (shows blue outline)
2. Press **`Delete`** or **`Backspace`**
3. Or click the 🗑️ button in toolbar

### View Note Info
- Timestamp in bottom-left shows when last edited
- Note size is fixed at 200x160 pixels
- Text automatically wraps if too long

---

## Default Sticky Note Properties

| Property | Value |
|----------|-------|
| Default Color | Yellow (#fef3c7) |
| Default Text | "Edit me..." |
| Size | 200x160 pixels |
| Draggable | Yes |
| Editable | Yes (double-click) |
| Deletable | Yes |
| Colorable | Yes (6 presets) |
| Z-index | Dynamic (new notes appear on top) |

---

## Color Options Available

```
1. Yellow (#fef3c7)    - Default, warm/informative
2. Red (#fecaca)       - Important, urgent
3. Green (#a7f3d0)     - Complete, done
4. Blue (#bfdbfe)      - Information, to-do
5. Purple (#ddd6fe)    - Ideas, brainstorm
6. Light (#f5f3ff)     - Archive, review later
```

---

## Tips & Tricks

### Speed Tips
- Use **Ctrl+N** (keyboard) instead of clicking button
- Double-click to edit immediately
- **Escape** key to cancel editing

### Organization Tips
- Use colors to categorize notes
- Group related notes together
- Use red for urgent items
- Use green for completed items

### Persistence
- All notes are **auto-saved** to IndexedDB
- Refresh the page → notes are restored
- Clear board button deletes all notes permanently

---

## Troubleshooting

### Note not appearing?
- Check browser console (F12) for errors
- Try creating another note
- Refresh page if stuck

### Text not saving?
- Make sure to click outside the note or press Escape
- Check browser console for errors
- Verify IndexedDB is available

### Can't edit note?
- Make sure to **double-click** (not single click)
- Single click = select, Double-click = edit

### Color picker not showing?
- Click the small colored dot in the corner
- Make sure note is not in edit mode
- Try clicking slightly to the right of the dot

---

## Sticky Note Data Structure

Each sticky note stores:
```typescript
{
  id: "unique-id",
  type: "sticky-note",
  position: { x: 100, y: 200 },
  zIndex: 5,
  createdAt: 1716379500000,
  updatedAt: 1716379600000,
  content: "Your text here",
  color: "#fef3c7",
  size: { width: 200, height: 160 }
}
```

---

## Keyboard Shortcuts for Notes

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` / `Cmd+N` | Create new note |
| `Double-click` | Edit note text |
| `Escape` | Cancel editing, save |
| `Delete` / `Backspace` | Delete selected note |
| `Ctrl+Scroll` | Zoom in/out (affects note size visually) |

---

## Advanced: Customizing Note Creation

Edit `components/elementUtils.ts` to change defaults:

```typescript
export function createStickyNote(position: Position): StickyNote {
  return {
    // ...
    content: 'Your default text',           // Change default text
    color: '#bfdbfe',                       // Change default color
    size: { width: 250, height: 200 },      // Change default size
  };
}
```

Then rebuild: `npm run build`

---

**Ready to create notes? Start by pressing Ctrl+N! 📝**
