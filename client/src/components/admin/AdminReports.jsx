import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import SalesChart from './SalesChart';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, salesHistory: [] });
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchReports();
        fetchStats();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            setStatsLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleDownload = async (filename) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/download/${filename}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download report');
        }
    };

    const triggerManualReport = async (type) => {
        try {
            setGenerating(true);
            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/generate`,
                { type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Report generated successfully');
            fetchReports();
            fetchStats(); // Update stats as well
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-serif font-black text-primary dark:text-accent">Financial Hub</h2>
                    <p className="text-sm text-text-muted">Real-time performance and archived reports</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { fetchReports(); fetchStats(); }}
                        className="p-2 rounded-xl glass border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all"
                        title="Refresh Data"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                    </button>
                    <button
                        onClick={() => triggerManualReport('monthly')}
                        disabled={generating}
                        className="btn btn-secondary flex items-center gap-2 text-sm"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Monthly PDF
                    </button>
                    <button
                        onClick={() => triggerManualReport('annual')}
                        disabled={generating}
                        className="btn btn-secondary flex items-center gap-2 text-sm"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Annual PDF
                    </button>
                </div>
            </div>

            {/* Real-time Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-6xl">payments</span>
                    </div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Live Revenue</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-serif text-accent">{statsLoading ? '...' : `₹${stats.totalRevenue}`}</p>
                        <span className="text-[10px] font-bold text-success px-1.5 py-0.5 bg-success/10 rounded">Live</span>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-6xl">shopping_cart</span>
                    </div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Total Orders</h3>
                    <p className="text-3xl font-serif text-accent">{statsLoading ? '...' : stats.totalOrders}</p>
                </div>

                {/* Placeholder for more granular stats if added to backend later */}
                <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-6xl">analytics</span>
                    </div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Avg Order Value</h3>
                    <p className="text-3xl font-serif text-accent">
                        {statsLoading ? '...' : stats.totalOrders > 0 ? `₹${(stats.totalRevenue / stats.totalOrders).toFixed(2)}` : '₹0.00'}
                    </p>
                </div>

                <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group bg-accent text-white flex flex-col justify-center items-center text-center cursor-pointer"
                    onClick={() => triggerManualReport('monthly')}
                >
                    <span className="material-symbols-outlined text-3xl mb-1">auto_awesome</span>
                    <p className="text-xs font-bold uppercase">Generate New PDF</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-accent">history</span>
                <h3 className="font-bold text-primary dark:text-accent font-serif">Report Archives</h3>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            ) : reports.length === 0 ? (
                <div className="glass p-12 text-center rounded-2xl border border-accent/10">
                    <span className="material-symbols-outlined text-6xl text-text-muted mb-4">description</span>
                    <p className="text-text-muted">No reports generated yet.</p>
                </div>
            ) : (
                <>
                    {/* Visual Trend */}
                    {!statsLoading && stats.salesHistory && stats.salesHistory.length > 0 && (
                        <div className="mb-8">
                            <SalesChart data={stats.salesHistory} />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div key={report.name} className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                    <span className="material-symbols-outlined">pdf_viewer</span>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${report.type === 'Monthly' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {report.type}
                                </span>
                            </div>
                            <h3 className="font-bold text-sm mb-1 truncate">{report.name}</h3>
                            <p className="text-xs text-text-muted mb-4">
                                Generated: {new Date(report.createdAt).toLocaleDateString()}
                                <br />
                                Size: {(report.size / 1024).toFixed(2)} KB
                            </p>
                            <button
                                onClick={() => handleDownload(report.name)}
                                className="w-full btn btn-accent flex items-center justify-center gap-2 text-xs py-2"
                            >
                                <span className="material-symbols-outlined text-sm">download</span>
                                Download PDF
                            </button>
                        </div>
                    ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReports;
