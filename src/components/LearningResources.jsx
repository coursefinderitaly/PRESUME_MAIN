import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, Download, Eye, File, FolderOpen, ArrowLeft, Layers } from 'lucide-react';

const LearningResources = () => {
  const [selectedCountry, setSelectedCountry] = useState('United Kingdom');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);

  const mockSystem = {
    'Countries': [
      { name: 'United Kingdom', type: 'folder' },
      { name: 'Canada', type: 'folder' },
      { name: 'Italy', type: 'folder' },
      { name: 'Georgia', type: 'folder' }
    ],
    'United Kingdom': [
      { name: 'UK Enquiry Forms', type: 'folder' },
      { name: 'UK Visa Documents', type: 'folder' },
      { name: 'UK Admission Guidelines', type: 'folder' }
    ],
    'UK Enquiry Forms': [
      { name: 'Student Intake Form.pdf', type: 'file', size: '1.2 MB' }
    ],
    'UK Visa Documents': [
      { name: 'Financial Matrix UK.xlsx', type: 'file', size: '3.2 MB' },
      { name: 'Tier 4 Visa Checklist.pdf', type: 'file', size: '800 KB' }
    ],
    'UK Admission Guidelines': [
      { name: 'UK Intakes 2026.pdf', type: 'file', size: '1.1 MB' }
    ],
    'Canada': [
      { name: 'Canada Enquiry Forms', type: 'folder' },
      { name: 'Canada Visa Documents', type: 'folder' }
    ],
    'Canada Enquiry Forms': [
      { name: 'Assessment Form.pdf', type: 'file', size: '1.5 MB' }
    ],
    'Canada Visa Documents': [
      { name: 'SDS Checklist.pdf', type: 'file', size: '900 KB' },
      { name: 'GIC Process Guide.docx', type: 'file', size: '1.1 MB' }
    ],
    'Italy': [
      { name: 'Italy Enquiry Forms', type: 'folder' },
      { name: 'Italy Visa Documents', type: 'folder' }
    ],
    'Italy Enquiry Forms': [
      { name: 'Pre-enrollment Form.pdf', type: 'file', size: '1.2 MB' }
    ],
    'Italy Visa Documents': [
      { name: 'DOV Requirements.pdf', type: 'file', size: '2.1 MB' },
      { name: 'CIMEA Guide.pdf', type: 'file', size: '1.8 MB' }
    ],
    'Georgia': [
      { name: 'Georgia Enquiry Forms', type: 'folder' },
      { name: 'Georgia Visa Documents', type: 'folder' }
    ],
    'Georgia Enquiry Forms': [
      { name: 'MBBS Application Form.pdf', type: 'file', size: '1.1 MB' }
    ],
    'Georgia Visa Documents': [
      { name: 'E-Visa Guidelines.pdf', type: 'file', size: '850 KB' }
    ]
  };

  const handleDownload = (file) => {
    setDownloadingFile(file.name);
    setTimeout(() => {
      setDownloadingFile(null);
      alert(`Successfully downloaded ${file.name} (${file.size})`);
    }, 1500);
  };

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return <FileText size={24} style={{ color: '#ef4444' }} />;
    } else if (ext === 'xlsx' || ext === 'xls') {
      return <FileText size={24} style={{ color: '#10b981' }} />;
    } else if (ext === 'docx' || ext === 'doc') {
      return <FileText size={24} style={{ color: '#3b82f6' }} />;
    }
    return <File size={24} style={{ color: '#fbbf24' }} />;
  };

  const countries = mockSystem['Countries'] || [];
  const categories = selectedCountry ? (mockSystem[selectedCountry] || []) : [];
  const currentFiles = selectedCategory ? (mockSystem[selectedCategory] || []) : [];

  return (
    <div className="view-resources" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <header className="dash-header" style={{ marginBottom: "16px", flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Learning Hub</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '1.05rem' }}>Access and retrieve authorized operating documents and resources.</p>
        </div>
      </header>
      
      {/* Split File Explorer Layout - 3 Columns */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flex: 1, 
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {/* Panel 1: Countries list */}
        <div style={{
          width: '240px',
          background: 'var(--card-bg-solid, rgba(15, 23, 42, 0.4))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '8px', marginBottom: '8px' }}>
            Destinations
          </div>
          {countries.map(country => {
            const isSelected = selectedCountry === country.name;
            return (
              <div 
                key={country.name}
                onClick={() => {
                  setSelectedCountry(country.name);
                  setSelectedCategory(null);
                  setSelectedFile(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(251, 191, 36, 0.12)' : 'transparent',
                  border: isSelected ? '1px solid rgba(251, 191, 36, 0.25)' : '1px solid transparent',
                  color: isSelected ? '#fbbf24' : 'var(--text-main)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
              >
                <Folder size={18} fill={isSelected ? "rgba(251, 191, 36, 0.3)" : "rgba(255, 255, 255, 0.1)"} color={isSelected ? "#fbbf24" : "var(--text-muted)"} />
                <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 700 : 600 }}>{country.name}</span>
                {isSelected && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
              </div>
            );
          })}
        </div>

        {/* Panel 2: Categories */}
        <div style={{
          width: '260px',
          background: 'var(--card-bg-solid, rgba(15, 23, 42, 0.4))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={12} /> {selectedCountry} Categories
          </div>
          {categories.length === 0 && (
            <div style={{ padding: '10px 8px', color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>No categories found.</div>
          )}
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div 
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedFile(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  border: isSelected ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                  color: isSelected ? '#3b82f6' : 'var(--text-main)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
              >
                <FolderOpen size={18} fill={isSelected ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)"} color={isSelected ? "#3b82f6" : "var(--text-muted)"} />
                <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 500 }}>{cat.name}</span>
                {isSelected && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
              </div>
            );
          })}
        </div>

        {/* Panel 3: Contents Viewer */}
        <div style={{
          flex: 1,
          background: 'var(--card-bg-solid, rgba(15, 23, 42, 0.4))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Path Header */}
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '15px 24px', 
            borderBottom: '1px solid var(--glass-border)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text-main)'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>{selectedCountry}</span>
            {selectedCategory && (
              <>
                <ChevronRight size={14} color="var(--text-muted)" />
                <span style={{ color: selectedFile ? 'var(--text-muted)' : '#3b82f6' }}>{selectedCategory}</span>
              </>
            )}
            {selectedFile && (
              <>
                <ChevronRight size={14} color="var(--text-muted)" />
                <span style={{ color: '#fbbf24' }}>{selectedFile.name}</span>
              </>
            )}
          </div>

          {/* Viewer Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {!selectedCategory ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                Please select a category from the middle panel to view files.
              </div>
            ) : selectedFile ? (
              /* FILE PREVIEW PANEL */
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                maxHeight: '400px',
                textAlign: 'center',
                animation: 'fadeIn 0.25s ease'
              }}>
                <div style={{ 
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  padding: '30px',
                  borderRadius: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxWidth: '420px',
                  width: '100%'
                }}>
                  <div style={{ display: 'flex', alignSelf: 'flex-start', marginBottom: '10px' }}>
                    <button 
                      onClick={() => setSelectedFile(null)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <ArrowLeft size={14} /> Back to Files
                    </button>
                  </div>
                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '16px', 
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    {getFileIcon(selectedFile.name)}
                  </div>
                  
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', wordBreak: 'break-word' }}>
                    {selectedFile.name}
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 600 }}>
                    <span>Size: {selectedFile.size}</span>
                    <span>•</span>
                    <span>Type: {selectedFile.name.split('.').pop().toUpperCase()} Document</span>
                  </div>

                  <button
                    onClick={() => handleDownload(selectedFile)}
                    disabled={downloadingFile !== null}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#000',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {downloadingFile ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={18} /> Download Resource
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* FOLDER CONTENTS TABLE */
              <div style={{ animation: 'fadeIn 0.25s ease' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'right' }}>Size</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'center', width: '80px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFiles.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                          This directory is empty.
                        </td>
                      </tr>
                    ) : (
                      currentFiles.map((item, idx) => (
                        <tr 
                          key={idx} 
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td 
                            onClick={() => setSelectedFile(item)}
                            style={{ 
                              padding: '14px 16px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '10px', 
                              color: 'var(--text-main)',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              cursor: 'pointer'
                            }}
                          >
                            {getFileIcon(item.name)}
                            <span style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-main)'}>
                              {item.name}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                            {item.type}
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'right', fontWeight: 500 }}>
                            {item.size || '--'}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleDownload(item)}
                              style={{
                                background: 'rgba(251, 191, 36, 0.1)',
                                border: '1px solid rgba(251, 191, 36, 0.2)',
                                color: '#fbbf24',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = '#fbbf24';
                                e.currentTarget.style.color = '#000';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
                                e.currentTarget.style.color = '#fbbf24';
                              }}
                              title="Download File"
                            >
                              <Download size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningResources;
