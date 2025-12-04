import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as LucideIcons from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import type { NavigationItem } from '../../types/navigation.types.ts';
import { useAuth } from '../../contexts/AuthContext';
import { menuConfig } from '../../constant/menuConfig.tsx';
import { kategoriService } from '../../services/kategoriService';

const DROPDOWNS_ALWAYS_OPEN = true;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogoutClick }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { user } = useAuth();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);

  const role = user?.role ?? 'ADMIN';

  // Fetch categories using React Query
  const { data: categories } = useQuery({
    queryKey: ['kategori-sidebar'],
    queryFn: async () => {
      const response = await kategoriService.findAll({ limit: 100, sortOrder: 'asc', sortBy: 'id' });
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update menu when role or categories change
  useEffect(() => {
    // Get base menu for role
    // Use shallow copy to preserve icon components
    const baseMenu = menuConfig[role] || [];

    if (categories && categories.length > 0) {
      // Create menu items from categories
      const categoryItems: NavigationItem[] = categories.map(cat => ({
        label: cat.name,
        path: `/${role.toLowerCase()}/arsip/${cat.slug}`,
        icon: LucideIcons.File
      }));

      // Find "Layanan Arsip" and append categories
      const updatedMenu = baseMenu.map((item) => {
        if (item.label === 'Layanan Arsip') {
          return {
            ...item,
            children: [
              ...(item.children || []),
              ...categoryItems
            ]
          };
        }
        return item;
      });

      setNavItems(updatedMenu);
    } else {
      setNavItems(baseMenu);
    }
  }, [role, categories]);

  useEffect(() => {
    if (!DROPDOWNS_ALWAYS_OPEN) {
      const newOpenMenus: string[] = [];
      navItems.forEach(item => {
        if (item.children) {
          const match = item.children.find(child => child.path === location.pathname);
          if (match) newOpenMenus.push(item.label);
        }
      });
      setOpenMenus(newOpenMenus);
    }
  }, [location.pathname, navItems]);

  const toggleMenu = (label: string) => {
    if (!DROPDOWNS_ALWAYS_OPEN) {
      setOpenMenus(prev =>
        prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
      );
    }
  };

  const renderItem = (item: NavigationItem) => {
    const Icon = item.icon || LucideIcons.Home;

    if (item.children) {
      const isMenuOpen = DROPDOWNS_ALWAYS_OPEN ? true : openMenus.includes(item.label);
      const isChildActive = item.children.some(child => child.path === location.pathname);

      return (
        <li key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={`flex w-full items-center rounded-lg p-3 text-base font-medium transition-colors ${isChildActive ? 'bg-white/10 text-white' : 'text-white hover:bg-white/10 hover:text-white'
              }`}
            aria-expanded={isMenuOpen}
            style={{ cursor: DROPDOWNS_ALWAYS_OPEN ? 'default' : 'pointer' }}
          >
            <div className="relative">
              <Icon className="h-6 w-6" />
              {item.notification && (
                <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {item.notification}
                </span>
              )}
            </div>
            <span className="ml-3 flex-1 text-left">{item.label}</span>
            {!DROPDOWNS_ALWAYS_OPEN && (
              <LucideIcons.ChevronDown
                className={`h-5 w-5 shrink-0 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''
                  }`}
              />
            )}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <ul className="ml-4 mt-1 space-y-1 border-l-2 border-white/20 pl-4">
              {item.children.map(child => {
                const ChildIcon = child.icon || LucideIcons.Home;
                return (
                  <li key={child.label}>
                    <NavLink
                      to={child.path!}
                      className={({ isActive }) =>
                        `flex items-center rounded-md p-2 text-sm transition-colors ${isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <ChildIcon className="h-4 w-4 mr-2" />
                      {child.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={item.label}>
        {item.isLogout ? (
          <button
            onClick={onLogoutClick}
            className="flex items-center w-full rounded-lg p-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Icon className="h-6 w-6" />
            <span className="ml-3">{item.label}</span>
          </button>
        ) : (
          <NavLink
            to={item.path!}
            className={({ isActive }) =>
              `flex items-center rounded-lg p-3 text-base font-semibold transition-colors ${isActive ? 'bg-white/20 text-white pulse-glow' : 'text-white hover:bg-white/10'
              }`
            }
          >
            <Icon className="h-6 w-6" />
            <span className="ml-3">{item.label}</span>
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r glass-effect transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/20 px-6 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
            <LucideIcons.Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Sistem Arsip</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-2 hover:bg-white/20 text-white lg:hidden transition-colors"
          aria-label="Tutup menu"
        >
          <LucideIcons.X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 sidebar-scroll">
        <ul className="space-y-2">
          <p className="px-4 pt-2 pb-3 text-xs font-semibold uppercase text-white/60">
            Menu Utama
          </p>
          {navItems.map(renderItem)}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;