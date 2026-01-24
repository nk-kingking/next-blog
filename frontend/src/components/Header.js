import React from 'react';
import { User, LogOut, PenLine } from 'lucide-react';
import useStore from '../store/useStore';

const Header = ({ onLogout, onNewBlog }) => {
  const { user } = useStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-950">NextBlog</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={onNewBlog}
            className="flex items-center gap-3 bg-orange-600/95 text-white px-4 py-2 rounded-lg hover:bg-orange-600/75 transition"
          >
            <PenLine className="h-4 w-4" />
            Write
          </button>
          <span className="text-gray-600 flex items-center gap-2">
            <User size={20} />
            {user?.display_name || user?.email}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;