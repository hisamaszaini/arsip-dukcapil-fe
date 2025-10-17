import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../ui/Spinner';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import { ConfirmationModal } from '../ui/ConfirmationModal';

const MainLayout: React.FC = () => {
    const { user, isLoading, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const openSidebar = () => setSidebarOpen(true);
    const closeSidebar = () => setSidebarOpen(false);
    const openLogoutModal = () => setIsLogoutModalOpen(true);
    const closeLogoutModal = () => setIsLogoutModalOpen(false);


    // Auto-close sidebar on route change (mobile)
    useEffect(() => {
        if (isSidebarOpen) {
            const handleResize = () => {
                if (window.innerWidth >= 1024) {
                    setSidebarOpen(false);
                }
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isSidebarOpen]);

    // Handle ESC key to close sidebar
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isSidebarOpen) {
                closeSidebar();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSidebarOpen]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isSidebarOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    const handleConfirmLogout = async () => {
        await logout();
        setIsLogoutModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <Spinner size={60} color="white" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="relative flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                onLogoutClick={openLogoutModal}
            />

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 z-20 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            <div className="flex flex-1 flex-col">
                <Header
                    user={user}
                    onMenuClick={openSidebar}
                    onLogoutClick={openLogoutModal}
                    title="Dashboard"
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    <Outlet />
                </main>

                <footer className="flex items-center justify-center px-6 py-4 min-h-16 bg-white/90 font-medium backdrop-blur-sm border-t border-slate-200 text-sm text-slate-500 text-center">
                    <p>
                        © 2025 Sistem Pengarsipan Digital.
                    </p>
                </footer>

                <ConfirmationModal
                    isOpen={isLogoutModalOpen}
                    onClose={closeLogoutModal}
                    onConfirm={handleConfirmLogout}
                    title="Konfirmasi Keluar"
                    message="Apakah Anda yakin ingin keluar dari aplikasi?"
                    confirmButtonText="Ya, Keluar"
                    variant="danger"
                />
            </div>
        </div>
    );
};

export default MainLayout;