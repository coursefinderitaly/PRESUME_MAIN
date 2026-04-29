import React, { useState } from 'react';
import { Download, Upload, Server, CheckCircle2, AlertCircle, FileSpreadsheet, Database, ShieldCheck, Globe, History } from 'lucide-react';
import { API_BASE_URL } from '../config';

const UniversityDataManagement = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleDownload = () => {
        window.location.href = `${API_BASE_URL}/sheets/download`;
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage({ type: 'error', text: 'Please select an Excel file to upload.' });
            return;
        }

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/sheets/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Excel file successfully updated. Live changes are now active.' });
                setFile(null);
                const fileInput = document.getElementById('excel-upload');
                if (fileInput) fileInput.value = '';
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to upload file.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Server connection failed.' });
        }
        
        setUploading(false);
    };

    return (
        <div style={{ padding: '10px 20px', animation: 'fadeIn 0.4s ease-out', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header Section - Compact */}
            <header className="dash-header" style={{ marginBottom: '15px', background: 'transparent', border: 'none', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '10px', color: 'white', display: 'flex', boxShadow: '0 0 15px rgba(0, 71, 171, 0.3)' }}>
                        <Database size={20} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>University Intelligence</h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>Update master database (courses.xlsx).</p>
                    </div>
                </div>
            </header>

            {/* Status Message - Floating and Compact */}
            {message && (
                <div style={{ 
                    padding: '10px 15px', 
                    borderRadius: '8px', 
                    marginBottom: '15px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                    color: message.type === 'success' ? '#34d399' : '#f87171',
                    animation: 'modalSlideUp 0.3s ease-out',
                    fontSize: '0.9rem'
                }}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span style={{ fontWeight: 500 }}>{message.text}</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', flex: 1 }}>
                
                {/* Download Card - Compact */}
                <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', padding: '15px', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--accent-secondary)' }}>
                            <FileSpreadsheet size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--accent-secondary)' }}>Extraction</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>
                        Download the current database for auditing or modification.
                    </p>
                    
                    <button 
                        onClick={handleDownload}
                        className="btn-save"
                        style={{ marginTop: 'auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'var(--glass-highlight)', border: '1px solid var(--glass-border)', fontSize: '0.85rem' }}
                    >
                        <Download size={16} /> Download courses.xlsx
                    </button>
                </div>

                {/* Upload Card - Compact */}
                <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', padding: '15px', gap: '12px', border: '1px solid var(--accent-secondary)', background: 'rgba(16, 185, 129, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '8px', color: '#10b981' }}>
                            <Upload size={18} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: '#10b981' }}>Injection</h3>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--glass-border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                        <input 
                            type="file" 
                            id="excel-upload"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="excel-upload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <div style={{ color: file ? '#10b981' : 'var(--text-muted)' }}>
                                {file ? <CheckCircle2 size={20} /> : <FileSpreadsheet size={20} />}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: file ? 'white' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                {file ? file.name : "Select courses.xlsx"}
                            </span>
                        </label>
                    </div>

                    <button 
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className="btn-save"
                        style={{ 
                            width: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '8px', 
                            padding: '10px', 
                            background: uploading || !file ? 'var(--glass-border)' : 'linear-gradient(135deg, #10b981, #059669)',
                            color: uploading || !file ? 'var(--text-muted)' : 'white',
                            opacity: uploading || !file ? 0.6 : 1,
                            fontSize: '0.85rem'
                        }}
                    >
                        {uploading ? <Server size={16} className="animate-pulse" /> : <ShieldCheck size={16} />}
                        {uploading ? "Updating..." : "Execute Live Update"}
                    </button>
                </div>

            </div>

            {/* Insight / Info Section - Horizontal and Ultra-Compact */}
            <div style={{ 
                marginTop: '15px', 
                background: 'rgba(0, 71, 171, 0.03)', 
                border: '1px solid rgba(0, 71, 171, 0.1)', 
                borderRadius: '12px', 
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px'
            }}>
                <div style={{ display: 'flex', itemsCenter: 'center', gap: '10px' }}>
                    <Globe size={16} style={{ color: 'var(--accent-secondary)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live Propagation</span>
                </div>
                <div style={{ display: 'flex', itemsCenter: 'center', gap: '10px' }}>
                    <History size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto Overwrite</span>
                </div>
                <div style={{ display: 'flex', itemsCenter: 'center', gap: '10px' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Header Integrity</span>
                </div>
            </div>
        </div>
    );
};

export default UniversityDataManagement;
