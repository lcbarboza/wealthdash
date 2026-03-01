import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
