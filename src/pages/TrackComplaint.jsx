import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getComplaint, updateComplaint, fmtDate, statusBadge, urgencyColor, loadComplaints } from '../data.js';

const STATUS_ORDER = ['Pending', 'In Progress', 'Resolved'];

function Timeline({ updates }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {[...updates].reverse().map((u, i) => (
        <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 16 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: i === 0 ? '#FF6B00' : '#C5CAE9',
              border: '2px solid',
              borderColor: i === 0 ? '#FF6B00' : '#C5CAE9',
              marginTop: 4, flexShrink: 0,
            }}/>
            {i < updates.length - 1 && (
              <div style={{ width: 2, flex: 1, background: '#C5CAE9', minHeight: 24 }}/>
            )}
          </div>
          <div style={{ paddingBottom: 20, flex: 1 }}>
            <p style={{ fontSize: 13, color: '#EFEFF0', marginBottom: 4 }}>{u.text}</p>
            <p style={{ fontSize: 11, color: '#7A9BA3' }}>{fmtDate(u.time)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SLABar({ filed, deadline }) {
  const total = new Date(deadline) - new Date(filed);
  const elapsed = Date.now() - new Date(filed);
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  const color = pct > 80 ? '#C62828' : pct > 60 ? '#F57C00' : '#138808';
  const remaining = new Date(deadline) - Date.now();
  const hrs = Math.max(0, Math.floor(remaining / 3600000));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7A9BA3', marginBottom: 6 }}>
        <span>SLA Progress</span>
        <span style={{ color }}>{hrs > 0 ? `${hrs}h remaining` : 'SLA Breached'}</span>
      </div>
      <div style={{ height: 6, background: '#E8EAF6', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s' }}/>
      </div>
    </div>
  );
}

export default function TrackComplaint() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingDone, setRatingDone] = useState(false);

  useEffect(() => {
    const id = params.get('id');
    if (id) search(id);
  }, []);

  function search(id) {
    const q = (id || query).trim().toUpperCase();
    const c = getComplaint(q);
    if (c) { setComplaint(c); setNotFound(false); if (c.rating) { setRating(c.rating); setRatingDone(true); } }
    else { setComplaint(null); setNotFound(true); }
  }

  function submitRating() {
    if (!rating) return;
    const updated = updateComplaint(complaint.id, { rating });
    setComplaint(updated);
    setRatingDone(true);
  }

  const statusIdx = STATUS_ORDER.indexOf(complaint?.status);

  return (
    <div className="page animate-in" style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Track Your Complaint</h1>
        <p style={{ color: '#607D8B', marginBottom: 32 }}>Enter your tracking ID to get real-time status updates.</p>

        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
          <input
            className="form-group"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="e.g. CMP-2024-0001"
            style={{
              flex: 1, background: '#fff', border: '1.5px solid #C5CAE9',
              borderRadius: 6, padding: '12px 16px', color: '#1A237E', fontSize: 15,
            }}
          />
          <button className="btn-primary" onClick={() => search()}>Track →</button>
        </div>

        {/* Sample IDs */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 12, color: '#607D8B', marginBottom: 8 }}>Try a sample ID:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {loadComplaints().slice(0, 5).map(c => (
              <button key={c.id} onClick={() => { setQuery(c.id); search(c.id); }}
                style={{ padding: '4px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  background: 'rgba(26,35,126,0.07)', border: '1px solid rgba(26,35,126,0.25)',
                  color: '#1A237E', transition: 'all 0.2s' }}>
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {notFound && (
          <div className="card" style={{ textAlign: 'center', color: '#f87171' }}>
            <p style={{ fontSize: 20, marginBottom: 8 }}>❌</p>
            <p>No complaint found with ID <strong>{query}</strong>. Please check and try again.</p>
          </div>
        )}

        {complaint && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header card */}
            <div className="card" style={{ borderColor: '#1A237E', borderTop: '3px solid #FF6B00' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, color: '#FF6B00', fontSize: 18 }}>{complaint.id}</span>
                    <span className={`badge ${statusBadge(complaint.status)}`}>{complaint.status}</span>
                  </div>
                  <h2 style={{ fontWeight: 700, fontSize: 16 }}>{complaint.category}</h2>
                  <p style={{ fontSize: 13, color: '#607D8B' }}>{complaint.address}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, color: urgencyColor(complaint.urgency), fontWeight: 700 }}>
                    ● {complaint.urgency} Priority
                  </span>
                  <p style={{ fontSize: 12, color: '#607D8B', marginTop: 4 }}>Filed: {fmtDate(complaint.filedOn)}</p>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#37474F', marginBottom: 16, lineHeight: 1.6 }}>
                {complaint.description}
              </p>

              <SLABar filed={complaint.filedOn} deadline={complaint.slaDeadline} />

              {complaint.assignedTo && (
                <p style={{ fontSize: 13, color: '#607D8B', marginTop: 12 }}>
                  Assigned to: <span style={{ color: '#138808', fontWeight: 600 }}>{complaint.assignedTo}</span>
                  &nbsp;·&nbsp; Dept: <span style={{ color: '#1A237E' }}>{complaint.department}</span>
                </p>
              )}
            </div>

            {/* Status stepper */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#1A237E' }}>Status Progress</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {STATUS_ORDER.map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_ORDER.length - 1 ? 1 : 'unset' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: i <= statusIdx ? (i === statusIdx ? '#FF6B00' : '#138808') : '#C5CAE9',
                        color: i <= statusIdx ? '#ffffff' : '#607D8B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 16,
                      }}>
                        {i < statusIdx ? '✓' : i === statusIdx ? '●' : '○'}
                      </div>
                      <span style={{ fontSize: 11, color: i === statusIdx ? '#FF6B00' : i < statusIdx ? '#138808' : '#607D8B', whiteSpace: 'nowrap', fontWeight: i === statusIdx ? 600 : 400 }}>{s}</span>
                    </div>
                    {i < STATUS_ORDER.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: i < statusIdx ? '#138808' : '#C5CAE9', margin: '0 4px', marginBottom: 20, transition: 'background 0.3s' }}/>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#1A237E' }}>Activity Timeline</h3>
              <Timeline updates={complaint.updates} />
            </div>

            {/* Rating */}
            {complaint.status === 'Resolved' && (
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Rate the Resolution</h3>
                <p style={{ fontSize: 13, color: '#7A9BA3', marginBottom: 16 }}>How satisfied are you with how your complaint was handled?</p>
                {ratingDone ? (
                  <p style={{ color: '#138808', fontWeight: 700 }}>✓ Thank you for your feedback! You rated: {'⭐'.repeat(rating)}</p>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setRating(n)}
                          style={{ fontSize: 28, background: 'none', cursor: 'pointer',
                            opacity: n <= rating ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                          ⭐
                        </button>
                      ))}
                    </div>
                    <button className="btn-primary" onClick={submitRating} disabled={!rating}>Submit Rating</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
