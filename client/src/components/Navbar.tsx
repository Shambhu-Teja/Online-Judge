import { Link, useLocation } from 'react-router-dom';
import { Code2, Trophy, Settings, LogOut, Search, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Problems', path: '/problems', icon: Code2 },
    { name: 'Contest', path: '/contest', icon: Trophy },
    { name: 'Home', path: '/home', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Code2 size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">AlgoCode</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    location.pathname === item.path
                      ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 gap-2">
              <Search size={14} />
              <span className="text-xs font-medium">Search...</span>
              <kbd className="text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 px-1 rounded shadow-sm">/</kbd>
            </div>

            <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <Settings size={20} />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

            <button
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
