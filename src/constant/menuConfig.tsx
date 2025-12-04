import type { NavigationItem } from "../types/navigation.types.ts";
import {
  Home,
  FileText,
  User,
  User2,
  LogOut,
  TagIcon,
} from "lucide-react";
import type { UserRole } from "../types/user.types";

export const menuConfig: Record<UserRole, NavigationItem[]> = {
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { label: 'Manajemen User', path: '/admin/user', icon: User2 },
    { label: 'Manajemen Kategori', path: '/admin/kategori', icon: TagIcon },
    {
      label: 'Layanan Arsip',
      icon: FileText,
      children: [
        // { label: 'Akta Kelahiran', path: '/admin/layanan-arsip/akta-kelahiran', icon: File },
        // { label: 'Akta Kematian', path: '/admin/layanan-arsip/akta-kematian', icon: File },
        // { label: 'Surat Kehilangan', path: '/admin/layanan-arsip/surat-kehilangan', icon: File },
        // { label: 'Surat Permohonan Pindah', path: '/admin/layanan-arsip/surat-permohonan-pindah', icon: File },
        // { label: 'Surat Perubahan Kependudukan', path: '/admin/layanan-arsip/surat-perubahan-kependudukan', icon: File },
      ],
    },
    { label: 'Pengaturan Akun', path: '/profile', icon: User },
    { label: 'Logout', icon: LogOut, isLogout: true },
  ],
  OPERATOR: [
    { label: 'Dashboard', path: '/operator/dashboard', icon: Home },
    {
      label: 'Layanan Arsip',
      icon: FileText,
      children: [
        // { label: 'Akta Kelahiran', path: '/operator/layanan-arsip/akta-kelahiran', icon: File },
        // { label: 'Akta Kematian', path: '/operator/layanan-arsip/akta-kematian', icon: File },
        // { label: 'Surat Kehilangan', path: '/operator/layanan-arsip/surat-kehilangan', icon: File },
        // { label: 'Surat Permohonan Pindah', path: '/operator/layanan-arsip/surat-permohonan-pindah', icon: File },
        // { label: 'Surat Perubahan Kependudukan', path: '/operator/layanan-arsip/surat-perubahan-kependudukan', icon: File },
      ],
    },
    { label: 'Pengaturan Akun', path: '/profile', icon: User },
    { label: 'Logout', icon: LogOut, isLogout: true },
  ],
};
