'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: number;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Simulate activity log
    const simulateActivity = () => {
      const actions = [
        'created a sticky note',
        'added a rectangle',
        'edited a note',
        'deleted an element',
        'panned the board',
        'zoomed in',
      ];
      const users = ['Alice', 'Bob', 'Charlie'];

      const newActivity: ActivityLog = {
        id: `activity-${Date.now()}`,
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        timestamp: Date.now(),
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateActivity();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 sm:p-3 md:p-4 w-56 sm:w-64 max-h-60 sm:max-h-80 overflow-y-auto">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 flex-shrink-0" />
        <h3 className="text-xs sm:text-sm font-semibold text-slate-700">Activity</h3>
      </div>

      <div className="space-y-1 sm:space-y-2">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400">No activity yet</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="text-xs text-slate-600 pb-1 sm:pb-2 border-b border-slate-100 last:border-0">
              <p className="font-medium text-slate-700">{activity.user}</p>
              <p className="text-slate-500 line-clamp-1">{activity.action}</p>
              <p className="text-slate-400 text-xs">
                {new Date(activity.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
