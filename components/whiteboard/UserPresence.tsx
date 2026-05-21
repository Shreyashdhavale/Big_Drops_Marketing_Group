'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number };
}

export function UserPresence() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alice', color: '#ff6b6b', cursor: { x: 100, y: 100 } },
    { id: '2', name: 'Bob', color: '#4ecdc4', cursor: { x: 300, y: 200 } },
  ]);

  useEffect(() => {
    // Simulate cursor movement
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          cursor: {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          },
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1 sm:gap-2 pointer-events-none">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-1 bg-white rounded-full px-2 sm:px-3 py-0.5 sm:py-1 shadow-sm text-xs sm:text-sm">
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: user.color }}
          />
          <span className="text-slate-600 font-medium truncate">{user.name}</span>
        </div>
      ))}
    </div>
  );
}
