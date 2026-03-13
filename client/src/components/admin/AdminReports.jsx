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
    const [reportType, setReportType] = useState('monthly'); // 'monthly' or 'annual'
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

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

    const handlePreview = async (filename) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/download/${filename}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            if (!filename.toLowerCase().endsWith('.pdf')) {
                toast.error('Preview is only available for PDF reports');
                return;
            }

            const file = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            setPreviewUrl(fileURL);
            setShowPreview(true);
        } catch (error) {
            toast.error('Failed to load preview');
        }
    };

    const handleDelete = async (filename) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/download/${filename}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Report deleted successfully');
            fetchReports();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete report');
        }
    };

    const triggerManualReport = async (type, format = 'pdf') => {
        try {
            setGenerating(true);
            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/generate`,
                { type, format },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`${format.toUpperCase()} Report generated successfully`);
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
                <div className="flex flex-wrap gap-2 items-center">
                    <button
                        onClick={() => { fetchReports(); fetchStats(); }}
                        className="p-2 rounded-xl glass border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all mr-2"
                        title="Refresh Data"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                    </button>
                    
                    {/* Filter Toggle */}
                    <div className="flex bg-accent/10 p-1 rounded-xl border border-accent/20 mr-2">
                        <button
                            onClick={() => setReportType('monthly')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reportType === 'monthly' ? 'bg-accent text-white shadow-md' : 'text-accent hover:bg-accent/5'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setReportType('annual')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reportType === 'annual' ? 'bg-accent text-white shadow-md' : 'text-accent hover:bg-accent/5'}`}
                        >
                            Annual
                        </button>
                    </div>

                    <div className="flex gap-2 bg-primary/5 p-1 rounded-xl border border-primary/10">
                        <button
                            onClick={() => triggerManualReport(reportType, 'pdf')}
                            disabled={generating}
                            className="px-4 py-1.5 rounded-lg bg-white dark:bg-black/20 text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 text-error"
                        >
                            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                            PDF
                        </button>
                        <button
                            onClick={() => triggerManualReport(reportType, 'excel')}
                            disabled={generating}
                            className="px-4 py-1.5 rounded-lg bg-white dark:bg-black/20 text-xs font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 text-success"
                        >
                            <span className="material-symbols-outlined text-[16px]">table_view</span>
                            Excel
                        </button>
                    </div>
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
                        <span className="material-symbols-outlined text-6xl">account_balance_wallet</span>
                    </div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Total GST</h3>
                    <p className="text-3xl font-serif text-accent">{statsLoading ? '...' : `₹${stats.totalGST}`}</p>
                </div>

                <div className="glass p-6 rounded-2xl border border-accent/10 hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-6xl">shopping_cart</span>
                    </div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Total Orders</h3>
                    <p className="text-3xl font-serif text-accent">{statsLoading ? '...' : stats.totalOrders}</p>
                </div>

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
                    onClick={() => triggerManualReport(reportType, 'pdf')}
                >
                    <span className="material-symbols-outlined text-3xl mb-1">picture_as_pdf</span>
                    <p className="text-xs font-bold uppercase">Update {reportType === 'monthly' ? 'Monthly' : 'Annual'} PDF</p>
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
                                <div className={`p-3 rounded-xl ${report.format === 'PDF' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                                    <span className="material-symbols-outlined">
                                        {report.format === 'PDF' ? 'picture_as_pdf' : 'table_view'}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${report.type === 'Monthly' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {report.type}
                                    </span>
                                    <span className="text-[10px] font-black opacity-50 uppercase">{report.format}</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-[13px] mb-1 line-clamp-1" title={report.name}>{report.name}</h3>
                            <p className="text-[10px] text-text-muted mb-4 font-bold">
                                {new Date(report.createdAt).toLocaleString()} • {(report.size / 1024).toFixed(0)} KB
                            </p>
                            <div className="flex gap-2">
                                {report.format === 'PDF' && (
                                    <button
                                        onClick={() => handlePreview(report.name)}
                                        className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all"
                                        title="Preview"
                                    >
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDownload(report.name)}
                                    className={`flex-1 btn flex items-center justify-center gap-2 text-xs py-2 ${report.format === 'PDF' ? 'btn-accent' : 'bg-success hover:bg-success-dark text-white'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Download
                                </button>
                                <button
                                    onClick={() => handleDelete(report.name)}
                                    className="p-2 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all"
                                    title="Delete"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                </>
            )}

            {/* Preview Modal Overlay */}
            {showPreview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowPreview(false)}></div>
                    <div className="glass w-full max-w-6xl h-[90vh] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col animate-in zoom-in-95 duration-500">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/20 rounded-xl">
                                    <span className="material-symbols-outlined text-accent">visibility</span>
                                </div>
                                <div>
                                    <h3 className="font-serif font-black text-white text-lg">Report Preview</h3>
                                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Confidential Financial Data</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="p-2.5 rounded-2xl bg-white/5 hover:bg-error/20 hover:text-error text-white/70 transition-all group"
                            >
                                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
                            </button>
                        </div>
                        <div className="flex-1 bg-[#2b2b2b] relative">
                            <iframe 
                                src={`${previewUrl}#toolbar=0`} 
                                className="w-full h-full border-none"
                                title="Report Preview"
                            ></iframe>
                        </div>
                        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5 backdrop-blur-xl">
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="px-8 py-3 rounded-2xl border border-white/10 text-white/70 text-xs font-black uppercase hover:bg-white/10 transition-all"
                            >
                                Close Preview
                            </button>
                            <a 
                                href={previewUrl} 
                                download="report_preview.pdf"
                                className="px-8 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase hover:bg-accent-dark transition-all shadow-[0_0_20px_rgba(183,161,121,0.3)] flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">download</span>
                                Download File
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
