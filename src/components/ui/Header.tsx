import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import type { User } from '../../types/user.types';

interface HeaderProps {
  user: User | null;
  title?: string;
  onMenuClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  title = "Dashboard",
  onMenuClick,
  onLogoutClick,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper inisial nama
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  // Helper sapaan
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return "Selamat pagi";
    if (hour >= 11 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 18) return "Selamat sore";
    return "Selamat malam";
  };

  // Menutup dropdown saat klik di luar area dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/20 px-4 md:px-8 bg-white shadow-md">
      <div className="flex items-center">
        <button
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden mr-4"
          aria-label="Buka menu"
          onClick={onMenuClick}
        >
          <LucideIcons.Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })} • {getGreeting()}!
          </p>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
            {getInitials(user.username)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900 capitalize">{(user.username).toLowerCase()}</p>
            <p className="text-xs text-gray-500">{user.role.toLowerCase()}</p>
          </div>
          <LucideIcons.ChevronDown
            className={`hidden sm:block h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* Menu Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-md border border-gray-200 py-1 z-50">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-gray-800">{(user.username).toLocaleUpperCase()}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LucideIcons.UserCircle className="h-4 w-4 text-gray-400" />
              <span>Profil Saya</span>
            </Link>
            <hr className="my-1 border-gray-200" />
            <button
              onClick={onLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LucideIcons.LogOut className="h-4 w-4 text-red-500" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;