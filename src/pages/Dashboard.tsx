import React from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import { 
    Users2, 
    Baby, 
    Skull, 
    FileSearch2, 
    ShieldAlert, 
    MoveRight, 
    FileSignature 
} from "lucide-react";
import DashboardChart from "../components/dashboard/DashboardChart";
import { formatTanggalSingkatTanpaTahun } from "../utils/date";

const getActivityItemStyle = (jenisLayanan: string) => {
    const styles: Record<string, string> = {
        "Akta Kelahiran": "bg-emerald-100 text-emerald-600",
        "Akta Kematian": "bg-slate-100 text-slate-600",
        "Surat Kehilangan": "bg-amber-100 text-amber-600",
        "Surat Permohonan Pindah": "bg-blue-100 text-blue-600",
        "Surat Perubahan Kependudukan": "bg-purple-100 text-purple-600",
    };
    return styles[jenisLayanan] || "bg-gray-100 text-gray-600";
};

const AdminDashboardPage: React.FC = () => {
    const {
        data: response,
        isLoading: isLoadingDashboard,
        isError: isErrorDashboard,
    } = useDashboardData();

    const dashboardData = response?.data;

    if (isLoadingDashboard) {
        return (
            <div className="flex h-96 w-full items-center justify-center">
                <Spinner size={50} color="#4f46e5" />
            </div>
        );
    }

    if (isErrorDashboard || !dashboardData) {
        return (
            <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg bg-red-50 p-6 text-center text-red-700">
                <ShieldAlert className="mb-4 h-12 w-12" />
                <h2 className="text-xl font-bold">Gagal Memuat Data</h2>
                <p className="mt-1 text-red-600">Terjadi kesalahan saat mengambil data dashboard. Silakan coba muat ulang halaman.</p>
            </div>
        );
    }

    const { stats, recentActivities, monthlyStats } = dashboardData;

    return (
        <>
            {/* ======================= */}
            {/*     STAT CARDS          */}
            {/* ======================= */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Jumlah Pengguna" 
                    value={stats.totalUser} 
                    icon={Users2} 
                    gradientClass="gradient-sky" 
                    animationDelay="0s" 
                />
                <StatCard 
                    title="Akta Kelahiran" 
                    value={stats.totalAktaKelahiran} 
                    icon={Baby} 
                    gradientClass="gradient-emerald" 
                    animationDelay="0.1s" 
                />
                <StatCard 
                    title="Akta Kematian" 
                    value={stats.totalAktaKematian} 
                    icon={Skull} 
                    gradientClass="gradient-slate" 
                    animationDelay="0.2s" 
                />
                <StatCard 
                    title="Surat Kehilangan" 
                    value={stats.totalSuratKehilangan} 
                    icon={FileSearch2} 
                    gradientClass="gradient-amber" 
                    animationDelay="0.3s" 
                />
                <StatCard 
                    title="Permohonan Pindah" 
                    value={stats.totalSuratPermohonanPindah} 
                    icon={MoveRight} 
                    gradientClass="gradient-blue" 
                    animationDelay="0.4s" 
                />
                <StatCard 
                    title="Perubahan Kependudukan" 
                    value={stats.totalSuratPerubahanKependudukan} 
                    icon={FileSignature} 
                    gradientClass="gradient-purple" 
                    animationDelay="0.5s" 
                />
            </section>

            {/* ======================= */}
            {/*       CHART + LIST      */}
            {/* ======================= */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
                {/* CHART */}
                <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800">Statistik Layanan</h3>
                    <p className="text-sm text-gray-500">Jumlah arsip dibuat dalam 6 bulan terakhir.</p>

                    <div className="mt-4 h-80 w-full">
                        <DashboardChart data={monthlyStats} />
                    </div>
                </div>

                {/* RECENT ACTIVITIES */}
                <div className="rounded-2xl bg-white p-6 shadow-lg lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">Arsip Terbaru</h3>
                    </div>

                    <div className="mt-4 flow-root">
                        {recentActivities.length > 0 ? (
                            <ul role="list" className="divide-y divide-gray-200">
                                {recentActivities.map((activity) => (
                                    <li key={`${activity.jenisLayanan}-${activity.id}`} className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${getActivityItemStyle(activity.jenisLayanan)}`}
                                                ></div>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900">{activity.jenisLayanan}</p>
                                                <p className="truncate text-sm text-gray-500">{activity.nama ?? "-"}</p>
                                            </div>

                                            <div className="inline-flex items-center text-right text-sm text-gray-500">
                                                {formatTanggalSingkatTanpaTahun(activity.createdAt)}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex h-full items-center justify-center text-center">
                                <p className="text-sm text-gray-500">Tidak ada aktivitas terbaru.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminDashboardPage;