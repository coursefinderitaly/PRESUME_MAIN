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
        <div style={{ padding: '20px', animation: 'fadeIn 0.4s ease-out' }}>
            {/* Header Section */}
            <header className="dash-header" style={{ marginBottom: '30px', background: 'transparent', border: 'none', padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'var(--accent-primary)', padding: '12px', borderRadius: '12px', color: 'white', display: 'flex', boxShadow: '0 0 20px rgba(0, 71, 171, 0.4)' }}>
                        <Database size={24} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-1px' }}>Global University Intelligence</h1>
                        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Synchronize and update the master university database (courses.xlsx).</p>
                    </div>
                </div>
            </header>

            {/* Status Message */}
            {message && (
                <div style={{ 
                    padding: '15px 20px', 
                    borderRadius: '12px', 
                    marginBottom: '25px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
                    color: message.type === 'success' ? '#34d399' : '#f87171',
                    animation: 'modalSlideUp 0.3s ease-out'
                }}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span style={{ fontWeight: 500 }}>{message.text}</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
                
                {/* Download Card */}
                <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>Extraction Center</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                Download the current production-grade database to your local workstation for auditing or manual modification.
                            </p>
                        </div>
                        <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--accent-secondary)' }}>
                            <FileSpreadsheet size={22} />
                        </div>
                    </div>
                    
                    <div style={{ marginTop: 'auto' }}>
                        <button 
                            onClick={handleDownload}
                            className="btn-save"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: 'var(--glass-highlight)', border: '1px solid var(--glass-border)' }}
                        >
                            <Download size={18} /> Download Master Sheet
                        </button>
                    </div>
                </div>

                {/* Upload Card */}
                <div className="profile-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px', border: '1px solid var(--accent-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#10b981' }}>Injection Terminal</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                Upload a new .xlsx file to instantly overwrite the production database. This action is irreversible and goes live immediately.
                            </p>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px', color: '#10b981' }}>
                            <Upload size={22} />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--glass-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                        <input 
                            type="file" 
                            id="excel-upload"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="excel-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div style={{ color: file ? '#10b981' : 'var(--text-muted)' }}>
                                {file ? <CheckCircle2 size={30} /> : <FileSpreadsheet size={30} />}
                            </div>
                            <span style={{ fontSize: '0.9rem', color: file ? 'white' : 'var(--text-muted)' }}>
                                {file ? file.name : "Click to select or drag courses.xlsx"}
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
                            gap: '10px', 
                            padding: '14px', 
                            background: uploading || !file ? 'var(--glass-border)' : 'linear-gradient(135deg, #10b981, #059669)',
                            color: uploading || !file ? 'var(--text-muted)' : 'white',
                            opacity: uploading || !file ? 0.6 : 1
                        }}
                    >
                        {uploading ? <Server size={18} className="animate-pulse" /> : <ShieldCheck size={18} />}
                        {uploading ? "Broadcasting to Hostinger..." : "Execute Live Update"}
                    </button>
                </div>

            </div>

            {/* Insight / Info Section */}
            <div style={{ 
                marginTop: '30px', 
                background: 'rgba(0, 71, 171, 0.05)', 
                border: '1px solid rgba(0, 71, 171, 0.15)', 
                borderRadius: '16px', 
                padding: '25px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
            }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ color: 'var(--accent-secondary)' }}><Globe size={24} /></div>
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: 'white' }}>Live Synchronization</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Updates propagate across the entire application ecosystem instantly upon upload completion.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ color: '#10b981' }}><History size={24} /></div>
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: 'white' }}>Automated Overwrite</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>The server handles file replacement automatically. No manual Hostinger FTP access required.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ color: 'var(--accent-primary)' }}><ShieldCheck size={24} /></div>
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: 'white' }}>Data Integrity</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Please ensure the column headers remain identical to the downloaded extraction file.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversityDataManagement;
