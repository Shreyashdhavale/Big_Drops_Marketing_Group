'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ActivityFeed } from './ActivityFeed';

export function ActivityToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      {/* Toggle button - visible only on mobile/tablet */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors fixed bottom-4 right-4 z-50 bg-white shadow-lg"
        title="View activity logs"
      >
        <MessageCircle className="w-5 h-5 text-slate-700" />
      </button>

      {/* Modal overlay on mobile/tablet */}
      {isOpen && (
        <div className="fixed inset-0 md:hidden z-40 bg-black/20" onClick={() => setIsOpen(false)} />
      )}

      {/* Activity feed modal on mobile/tablet */}
      <div className="fixed md:hidden bottom-20 right-4 z-50">
        {isOpen && <ActivityFeed />}
      </div>
    </div>
  );
}
