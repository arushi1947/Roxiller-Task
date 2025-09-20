// src/components/Layout.jsx
import React, { useState } from 'react';
import clsx from 'clsx';
import { FiMenu } from 'react-icons/fi';

export default function Layout({ children, sidebarItems = [] }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={clsx(
        'bg-white border-r transition-all duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}>
        <div className="h-16 flex items-center px-4 justify-between border-b">
          <div className={clsx('font-bold text-lg text-indigo-600', collapsed && 'hidden')}>
            Roxiller
          </div>
          <button
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FiMenu />
          </button>
        </div>

        <nav className="p-4">
          {sidebarItems.map(item => (
            <a
              key={item.to}
              href={item.to}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              <span className={clsx(collapsed && 'hidden')}>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
      <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
