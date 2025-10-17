import type { NavigationItem } from "../types/navigation.types.ts";
import {
  Home,
  FileText,
  Inbox,
  File,
  User,
  User2,
  LogOut,
} from "lucide-react";
import type { UserRole } from "../types/user.types";

export const menuConfig: Record<UserRole, NavigationItem[]> = {
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { label: 'Data User', path: '/admin/user', icon: User2 },
    {
      label: 'Layanan Arsip',
      icon: FileText,
      children: [
        { label: 'Akta Kelahiran', path: '/admin/layanan-arsip/akta-kelahiran', icon: Inbox },
        { label: 'Akta Kematian', path: '/admin/layanan-arsip/akta-kematian', icon: File },
        { label: 'Surat Kehilangan', path: '/admin/layanan-arsip/surat-kehilangan', icon: File },
      ],
    },
    { label: 'Pengaturan Akun', path: '/profile', icon: User },
    { label: 'Logout', icon: LogOut, isLogout: true },
  ],
    OPERATOR: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { label: 'Data User', path: '/admin/user', icon: User2 },
    {
      label: 'Layanan Arsip',
      icon: FileText,
      children: [
        { label: 'Akta Kelahiran', path: '/admin/layanan-arsip/akta-kelahiran', icon: Inbox },
        { label: 'Akta Kematian', path: '/admin/layanan-arsip/akta-kematian', icon: File },
        { label: 'Surat Kehilangan', path: '/admin/layanan-arsip/surat-kehilangan', icon: File },
      ],
    },
    { label: 'Pengaturan Akun', path: '/profile', icon: User },
    { label: 'Logout', icon: LogOut, isLogout: true },
  ],
};
