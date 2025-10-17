import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  path?: string;
  icon: LucideIcon;
  children?: NavigationItem[];
  notification?: number;
  isLogout?: boolean;
  onClick?: () => void;
}