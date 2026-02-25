import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchReports();
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
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-black text-primary dark:text-accent">Financial Reports</h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => triggerManualReport('monthly')}
                        disabled={generating}
                        className="btn btn-secondary flex items-center gap-2 text-sm"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Generate Monthly
                    </button>
                    <button
                        onClick={() => triggerManualReport('annual')}
                        disabled={generating}
                        className="btn btn-secondary flex items-center gap-2 text-sm"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Generate Annual
                    </button>
                </div>
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
            )}
        </div>
    );
};

export default AdminReports;
