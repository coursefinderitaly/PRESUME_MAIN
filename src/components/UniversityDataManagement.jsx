import React, { useState } from 'react';
import { Download, Upload, Server, CheckCircle2, AlertCircle, FileSpreadsheet, Database } from 'lucide-react';
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
                // clear file input
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
        <div className="animate-fade-in space-y-8">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Database size={24} className="text-accent-secondary" />
                    University Data Management
                </h2>
                <p className="text-gray-400 mt-2">
                    Update the courses.xlsx file used across the platform to display university programs.
                </p>
            </header>

            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                    message.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Download Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                            <Download size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Current Data File</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Download the current courses.xlsx file to your local machine to view or make edits.
                        </p>
                    </div>
                    <button 
                        onClick={handleDownload}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <FileSpreadsheet size={18} />
                        Download courses.xlsx
                    </button>
                </div>

                {/* Upload Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-4">
                            <Upload size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Upload New Data</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Upload an updated courses.xlsx. Changes will reflect instantly on the frontend and backend.
                        </p>
                        
                        <input 
                            type="file" 
                            id="excel-upload"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer mb-6"
                        />
                    </div>
                    <button 
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                            uploading || !file 
                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                            : 'bg-accent-secondary text-white hover:bg-blue-600'
                        }`}
                    >
                        {uploading ? (
                            <>
                                <Server size={18} className="animate-pulse" /> Uploading to Server...
                            </>
                        ) : (
                            <>
                                <Server size={18} /> Update Live Database
                            </>
                        )}
                    </button>
                </div>

            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 mt-8">
                <h4 className="text-blue-400 font-bold flex items-center gap-2 mb-2">
                    <Server size={16} /> Hostinger Deployment Note
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                    When this is deployed to Hostinger, uploading a new file will <strong>instantly replace</strong> the 'courses.xlsx' file in the backend directory. Any user performing a new search or refreshing the page will immediately receive the updated data from the backend without requiring a server restart.
                </p>
            </div>
        </div>
    );
};

export default UniversityDataManagement;
