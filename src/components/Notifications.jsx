import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bell, CheckCircle, Info } from 'lucide-react';
import { API_BASE_URL } from '../config';

const renderChatText = (html) => {
  if (!html) return null;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const Notifications = ({ profile }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const chatBottomRef = useRef(null);
  const replyEditorRef = useRef(null);

  const execFormat = (e, command) => {
    e.preventDefault();
    replyEditorRef.current?.focus();
    document.execCommand(command, false, null);
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/erp/my-messages`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const sendReply = async () => {
    const html = replyEditorRef.current?.innerHTML?.trim();
    const text = replyEditorRef.current?.innerText?.trim();
    if (!text) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/erp/my-messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf-protected': '1' },
        body: JSON.stringify({ text: html })
      });
      if (res.ok) {
        if (replyEditorRef.current) replyEditorRef.current.innerHTML = '';
        setSendStatus('success');
        await fetchMessages();
        setTimeout(() => setSendStatus(''), 3000);
      } else {
        setSendStatus('error');
        setTimeout(() => setSendStatus(''), 3000);
      }
    } catch (err) {
      setSendStatus('error');
      setTimeout(() => setSendStatus(''), 3000);
    }
    setSending(false);
  };

  return (
    /* ── Phase 4: notif-full-wrap keeps everything inside 100vh ── */
    <div className="notif-full-wrap">

      {/* Compact header */}
      <header className="dash-header" style={{ marginBottom: "20px" }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
            <Bell size={18} style={{ color: 'var(--accent-secondary)' }} />
            Notifications
          </h1>
          <p style={{ fontSize: '0.75rem', margin: 0 }}>Admin messages and system alerts.</p>
        </div>
      </header>

      {/* ── Body: grid of messages + side notices ── */}
      <div className="notif-body-grid">

        {/* ADMIN MESSAGES PANEL */}
        <div className="notif-msg-panel">

          {/* Panel header */}
          <div style={{ padding: '9px 14px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ background: 'var(--accent-glow)', padding: '5px', borderRadius: '7px' }}>
              <MessageSquare size={12} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-main)' }}>Messages from Admin</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                {messages.length === 0 ? 'No messages yet' : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>

          {/* Scrollable messages area */}
          <div className="notif-msg-scroll">
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 20px', fontSize: '0.85rem' }}>Loading messages...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <MessageSquare size={32} style={{ opacity: 0.15, display: 'block', margin: '0 auto 10px' }} />
                <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>No messages yet</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: '1.5' }}>
                  When the admin sends you a message, it will appear here.
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'student' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', minWidth: 0, padding: '7px 11px',
                    borderRadius: msg.sender === 'student' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.sender === 'student' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)',
                    color: 'var(--text-main)', fontSize: '0.8rem', lineHeight: '1.5',
                    border: '1px solid var(--glass-border)',
                    wordBreak: 'break-word', overflowWrap: 'break-word'
                  }}>
                    <div style={{ fontSize: '0.58rem', opacity: 0.6, marginBottom: '3px', fontWeight: 600, textTransform: 'uppercase' }}>
                      {msg.sender === 'student' ? 'You' : '🛡️ Admin'}
                    </div>
                    {renderChatText(msg.text)}
                    <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '3px', textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(msg.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Reply bar */}
          <div style={{ borderTop: '1px solid var(--glass-border)', padding: '8px 10px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', gap: '2px', padding: '2px 4px', background: 'var(--glass-highlight)', borderRadius: '6px', border: '1px solid var(--glass-border)', alignItems: 'center' }}>
                <button onMouseDown={(e) => execFormat(e, 'bold')} title="Bold"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '3px 7px', borderRadius: '4px', cursor: 'pointer', fontWeight: 900, fontSize: '0.75rem' }}>B</button>
                <button onMouseDown={(e) => execFormat(e, 'italic')} title="Italic"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '3px 7px', borderRadius: '4px', cursor: 'pointer', fontStyle: 'italic', fontSize: '0.75rem' }}>I</button>
              </div>
              <button onClick={sendReply} disabled={sending}
                style={{ background: 'var(--accent-glow)', color: 'var(--accent-secondary)', border: '1px solid var(--glass-border)', padding: '5px 13px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, fontSize: '0.76rem' }}>
                <Send size={11} /> Send
              </button>
            </div>
            <div
              ref={replyEditorRef}
              contentEditable suppressContentEditableWarning
              style={{ width: '100%', height: '65px', overflowY: 'auto', background: 'var(--glass-highlight)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '8px 12px', borderRadius: '10px', outline: 'none', fontSize: '0.85rem', fontFamily: 'inherit', lineHeight: '1.5', wordBreak: 'break-word', boxSizing: 'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
            {sendStatus === 'success' && <div style={{ marginTop: '5px', color: 'var(--accent-primary)', fontSize: '0.72rem', textAlign: 'center' }}>✓ Sent!</div>}
            {sendStatus === 'error' && <div style={{ marginTop: '5px', color: '#f87171', fontSize: '0.72rem', textAlign: 'center' }}>✗ Failed. Try again.</div>}
          </div>
        </div>

        {/* SYSTEM NOTICES — right column, scrolls internally */}
        <div className="notif-side-panel">
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px', overflow: 'hidden', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={13} color="var(--accent-secondary)" />
              <span style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-main)' }}>System Notices</span>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {[
                { icon: CheckCircle, title: 'Account Secured',       text: 'Never share your credentials.' },
                { icon: Info,        title: 'Application Processing', text: 'Allow 48 hrs for status updates.' },
                { icon: Info,        title: 'Document Submission',    text: 'Ensure uploads are valid and clear.' },
                { icon: CheckCircle, title: 'Intake Deadlines',       text: 'Sep 2026 deadlines are approaching.' },
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: '9px', padding: '9px', background: 'var(--glass-highlight)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ padding: '5px', borderRadius: '7px', display: 'flex', alignItems: 'flex-start', flexShrink: 0, background: 'var(--accent-glow)' }}>
                    <n.icon size={12} color="var(--accent-secondary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>{n.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notifications;
