import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Mail, Phone, Globe, 
  Search, Filter, CheckCircle, Circle, Trash2, 
  ChevronRight, ArrowLeft, MoreVertical, Eye
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', status: 'all', type: 'all' });
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.status !== 'all') queryParams.append('status', filter.status);
      if (filter.type !== 'all') queryParams.append('consultancyType', filter.type);
      if (filter.search) queryParams.append('search', filter.search);

      const res = await fetch(`${API_BASE_URL}/appointments?${queryParams.toString()}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter.status, filter.type]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-protected': '1'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setAppointments(prev => prev.map(a => a._id === id ? updated : a));
        if (selectedAppointment && selectedAppointment._id === id) {
          setSelectedAppointment(updated);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'x-csrf-protected': '1' }
      });
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a._id !== id));
        if (selectedAppointment && selectedAppointment._id === id) {
          setSelectedAppointment(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete appointment:", err);
    }
  };

  const consultancyTypes = [
    "Study Visa Consultancy",
    "Work Visa Consultancy",
    "Tourist Visa Consultancy",
    "Program Visa Consultancy"
  ];

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: 'var(--text-main)', fontSize: '1.6rem', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Appointment Records
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage consultation bookings from the website.</p>
        </div>
        <button 
          onClick={fetchAppointments}
          style={{ background: 'var(--input-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Refresh Data
        </button>
      </header>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name, email or phone..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && fetchAppointments()}
            style={{ width: '100%', padding: '10px 15px 10px 40px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-main)' }}
          />
        </div>
        <select 
          className="theme-select"
          value={filter.status}
          onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
          style={{ padding: '10px 15px', border: '1px solid var(--glass-border)', borderRadius: '10px' }}
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <select 
          className="theme-select"
          value={filter.type}
          onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
          style={{ padding: '10px 15px', border: '1px solid var(--glass-border)', borderRadius: '10px' }}
        >
          <option value="all">All Services</option>
          {consultancyTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>
        {/* LIST VIEW */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--card-bg-solid)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
          ) : appointments.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No appointments found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '15px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '15px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Candidate</th>
                  <th style={{ textAlign: 'left', padding: '15px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service</th>
                  <th style={{ textAlign: 'left', padding: '15px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Schedule</th>
                  <th style={{ textAlign: 'center', padding: '15px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr 
                    key={appt._id} 
                    onClick={() => setSelectedAppointment(appt)}
                    style={{ 
                      borderTop: '1px solid var(--glass-border)', 
                      cursor: 'pointer',
                      background: selectedAppointment?._id === appt._id ? 'var(--input-bg)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                    className="hover-row"
                  >
                    <td style={{ padding: '15px' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '4px 10px', 
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: appt.status === 'unread' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: appt.status === 'unread' ? '#ef4444' : '#10b981'
                      }}>
                        {appt.status === 'unread' ? <Circle size={10} fill="#ef4444" /> : <CheckCircle size={10} />}
                        {appt.status}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{appt.fullname}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.email}</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{appt.consultancyType}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.subOption}</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Calendar size={14} color="var(--accent-secondary)" /> {appt.date}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <Clock size={14} /> {appt.time}
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(appt._id, appt.status); }}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          title={appt.status === 'unread' ? "Mark as read" : "Mark as unread"}
                        >
                          {appt.status === 'unread' ? <CheckCircle size={18} /> : <Circle size={18} />}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(appt._id); }}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          title="Delete record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* DETAIL VIEW */}
        {selectedAppointment && (
          <div className="animate-slide-in-right" style={{ width: '350px', background: 'var(--card-bg-solid)', borderRadius: '16px', border: '1px solid var(--glass-border)', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ArrowLeft size={20} /></button>
            </div>

            <div style={{ spaceY: '20px' }}>
              <section style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Candidate Info</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={16} color="var(--accent-primary)" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedAppointment.fullname}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Name</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} color="var(--accent-primary)" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedAppointment.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={16} color="var(--accent-primary)" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedAppointment.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={16} color="var(--accent-primary)" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedAppointment.country}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Origin Country</div>
                    </div>
                  </div>
                </div>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Consultation Details</div>
                <div style={{ padding: '15px', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '4px' }}>{selectedAppointment.consultancyType}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>{selectedAppointment.subOption}</div>
                </div>
              </section>

              <section style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Scheduled Date & Time</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, padding: '12px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '12px', textAlign: 'center' }}>
                    <Calendar size={18} color="#fbbf24" style={{ marginBottom: '5px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedAppointment.date.split(',')[0]}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{selectedAppointment.date.split(',')[1]}</div>
                  </div>
                  <div style={{ flex: 1, padding: '12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', textAlign: 'center' }}>
                    <Clock size={18} color="#6366f1" style={{ marginBottom: '5px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedAppointment.time}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Local Time</div>
                  </div>
                </div>
              </section>

              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button 
                  onClick={() => handleToggleStatus(selectedAppointment._id, selectedAppointment.status)}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: 'none', 
                    background: selectedAppointment.status === 'unread' ? 'var(--accent-primary)' : 'var(--input-bg)',
                    color: selectedAppointment.status === 'unread' ? '#fff' : 'var(--text-main)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {selectedAppointment.status === 'unread' ? 'Mark as Processed' : 'Mark as Unread'}
                </button>
                <button 
                  onClick={() => handleDelete(selectedAppointment._id)}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    background: 'rgba(239, 68, 68, 0.05)',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsManagement;
