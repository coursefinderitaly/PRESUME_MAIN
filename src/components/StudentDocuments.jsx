import React, { useState, useEffect } from 'react';
import { Download, Search, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config';

const StudentDocuments = () => {
  const [students, setStudents] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounselorId, setSelectedCounselorId] = useState('all');

  useEffect(() => {
    fetchStudents();
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/erp/counselors`, {
        credentials: 'include',
        headers: { 'x-csrf-protected': '1' }
      });
      if (response.ok) {
        setCounselors(await response.json());
      }
    } catch (err) {
      console.error("Failed to fetch counselors", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/erp/students`, {
        credentials: 'include',
        headers: { 'x-csrf-protected': '1' }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter only students who have a documentZip available
        const withDocs = data.filter(s => s.documentZip);
        setStudents(withDocs);
      }
    } catch (err) {
      console.error("Failed to fetch students for documents", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCounselor = selectedCounselorId === 'all' || 
      (student.assignedCounselor && (student.assignedCounselor._id === selectedCounselorId || student.assignedCounselor === selectedCounselorId));

    return matchesSearch && matchesCounselor;
  });

  return (
    <div style={{ padding: '20px', animation: 'fadeIn 0.3s ease' }}>
      <header className="dash-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1>Student Documents</h1>
          <p>Download the latest document bundles uploaded by your students.</p>
        </div>
      </header>

      <div className="filters-row" style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--card-bg)', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>

        <div className="counselor-filter" style={{ minWidth: '200px' }}>
          <select
            value={selectedCounselorId}
            onChange={(e) => setSelectedCounselorId(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--card-bg)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Counselors</option>
            {counselors.map(c => (
              <option key={c._id} value={c._id}>
                Filter by: {c.firstName} {c.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading documents...</div>
      ) : filteredStudents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
          <FileText size={48} style={{ color: 'var(--glass-border)', marginBottom: '15px' }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: '5px' }}>No Documents Available</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>None of your students have uploaded documents yet, or no matches found.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--table-header-bg)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Student Name</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Assigned Counselor</th>
                <th style={{ padding: '15px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} className="hover-row">
                  <td style={{ padding: '15px 20px', color: 'var(--text-main)', fontWeight: 500 }}>{student.firstName} {student.lastName}</td>
                  <td style={{ padding: '15px 20px', color: 'var(--text-muted)' }}>{student.email}</td>
                  <td style={{ padding: '15px 20px', color: 'var(--text-main)' }}>
                    {student.assignedCounselor ? (
                      <div>
                        <div style={{ fontWeight: 500 }}>{student.assignedCounselor.firstName} {student.assignedCounselor.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.assignedCounselor.email}</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <a
                      href={`${API_BASE_URL}/upload/download/${student.documentZip}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-save"
                      style={{ background: '#10b981', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}
                    >
                      <Download size={14} /> Download ZIP
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDocuments;
