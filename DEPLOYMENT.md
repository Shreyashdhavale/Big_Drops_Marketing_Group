# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository configured
- Vercel or Netlify account

## Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Vercel Deployment (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Build: Interactive Collaborative Whiteboard MVP

- Core canvas with SVG-based rendering
- Sticky notes with edit/delete/recolor
- Shapes: rectangles, circles, lines
- Drag and drop positioning
- Pan/zoom with Ctrl+Scroll
- Keyboard shortcuts (Ctrl+N, R, C, L, Delete)
- IndexedDB persistence with auto-save
- Simulated collaboration with user presence
- Activity feed and toolbar
- Responsive design
- Full TypeScript support

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

git push
```

### Step 2: Deploy to Vercel
```bash
npm i -g vercel
vercel
```

Or connect via Vercel Dashboard:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

Vercel will automatically:
- Install dependencies
- Build the Next.js app
- Deploy to a live URL

## Netlify Deployment

### Step 1: Build
```bash
npm run build
```

### Step 2: Deploy
Using Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir .next
```

Or use Netlify Dashboard:
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

## Environment Variables
No environment variables required for MVP. All data stored locally via IndexedDB.

## Post-Deployment Testing

1. **Verify Functionality**
   - Create a sticky note
   - Add shapes (rectangle, circle, line)
   - Drag elements around
   - Zoom in/out
   - Edit note text
   - Change note color
   - Delete elements

2. **Verify Persistence**
   - Create some elements
   - Refresh the page (Cmd+R / Ctrl+R)
   - Verify elements are still there

3. **Verify Responsive Design**
   - Test on mobile device or DevTools mobile view
   - Verify toolbar is accessible
   - Verify touch interactions work

4. **Check Browser Console**
   - Verify no errors
   - Check Zustand store in DevTools (Redux DevTools)

## Troubleshooting

### Page Loads Blank
- Check browser console for errors
- Verify all dependencies installed: `npm install`
- Clear .next cache: `rm -rf .next && npm run build`

### Elements Not Persisting
- Check if IndexedDB is available (not in private browsing)
- Verify DevTools > Application > IndexedDB
- Check browser console for errors

### Drag Not Working
- Verify CSS loaded correctly (Tailwind)
- Check that SVG has proper pointer events
- Verify event listeners attached in browser DevTools

### Zoom/Pan Issues
- Verify mouse wheel events firing (check DevTools console)
- Try in different browser
- Check for JavaScript errors

## Performance Optimization

Already implemented:
- SVG transforms (efficient rendering)
- Debounced auto-save (1 second)
- Event delegation on canvas
- Memoized components
- Z-index sorted only on changes

For further optimization:
- Add React.memo to stable components
- Implement virtual scrolling if many elements (100+)
- Use Web Workers for persistence operations
- Implement proper compression for IndexedDB

## Monitoring

Set up monitoring in Vercel:
1. Dashboard → Project → Settings → Monitoring
2. Enable Web Vitals monitoring
3. Set up error tracking

## Next Steps for Production

1. **Add Real-time Collaboration**
   - Set up WebSocket server
   - Implement user accounts
   - Add collaborative editing

2. **Add User Accounts**
   - Implement authentication (Auth0, Supabase, etc.)
   - Add board sharing/permissions
   - Implement user profiles

3. **Add Advanced Features**
   - Undo/Redo
   - Board templates
   - Export as image
   - Team boards
   - Real-time cursor presence

4. **Performance**
   - Implement infinite canvas
   - Add viewport culling
   - Implement tile-based rendering for large boards

5. **Analytics**
   - Track feature usage
   - Monitor performance
   - User engagement metrics

## Support

For issues or questions, check:
- GitHub Issues
- Vercel/Netlify documentation
- Next.js documentation
- Zustand documentation
