import { useState, useEffect } from 'react';
import { loadComplaints, updateComplaint, fmtDate, statusBadge, urgencyColor, CATEGORIES } from '../data.js';

const OFFICERS = ['Officer Priya Sharma', 'Officer Arjun Nair', 'Officer Meera Iyer', 'Officer Rahul Gupta', 'Officer Ananya Singh'];

function ComplaintRow({ c, onClick }) {
  const overdue = c.status !== 'Resolved' && new Date(c.slaDeadline) < new Date();
  return (
    <tr onClick={onClick} style={{ cursor: 'pointer', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,35,126,0.05)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#FF6B00' }}>{c.id}</td>
      <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.name}</td>
      <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.category}</td>
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: urgencyColor(c.urgency) }}>● {c.urgency}</span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span className={`badge ${statusBadge(c.status)}`}>{c.status}</span>
      </td>
      <td style={{ padding: '12px 16px', fontSize: 12, color: overdue ? '#C62828' : '#607D8B' }}>
        {overdue ? '⚠ Overdue' : fmtDate(c.slaDeadline).split(',')[0]}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 12, color: c.assignedTo ? '#138808' : '#F57C00' }}>
        {c.assignedTo ? c.assignedTo.replace('Officer ', '') : 'Unassigned'}
      </td>
    </tr>
  );
}

function Modal({ complaint: c, onClose, onUpdate }) {
  const [status, setStatus] = useState(c.status);
  const [officer, setOfficer] = useState(c.assignedTo || '');
  const [note, setNote] = useState('');

  function save() {
    const updates = [...c.updates];
    if (note.trim()) updates.push({ time: new Date().toISOString(), text: note.trim() });
    const updated = updateComplaint(c.id, {
      status,
      assignedTo: officer || null,
      updates,
    });
    onUpdate(updated);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
      <div className="card animate-in" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', border: '2px solid #FF6B00' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <span style={{ fontWeight: 800, color: '#FF6B00' }}>{c.id}</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{c.category}</h3>
            <p style={{ fontSize: 13, color: '#607D8B' }}>{c.address}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: '#7A9BA3', fontSize: 20, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>

        <div style={{ background: '#F0F2FF', borderRadius: 8, padding: 14, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: '#37474F', lineHeight: 1.6 }}>{c.description}</p>
          <p style={{ fontSize: 12, color: '#7A9BA3', marginTop: 8 }}>
            Filed by: <strong style={{ color: '#1A237E' }}>{c.name}</strong> · {c.phone} · {c.language}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div className="form-group">
            <label>Update Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {['Pending', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Assign Officer</label>
            <select value={officer} onChange={e => setOfficer(e.target.value)}>
              <option value="">Unassigned</option>
              {OFFICERS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Add Update Note (optional)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
            placeholder="e.g. Field officer dispatched. Expected resolution by tomorrow." />
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#FF6B00', marginBottom: 12 }}>Activity Log</h4>
          {[...c.updates].reverse().map((u, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #E8EAF6' }}>
              <p style={{ fontSize: 12, color: '#37474F' }}>{u.text}</p>
              <p style={{ fontSize: 11, color: '#607D8B', marginTop: 2 }}>{fmtDate(u.time)}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary" onClick={save} style={{ flex: 1 }}>Save Changes</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function OfficerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState({ status: '', urgency: '', category: '', search: '' });
  const [selected, setSelected] = useState(null);

  useEffect(() => { setComplaints(loadComplaints()); }, []);

  const reload = () => setComplaints(loadComplaints());

  const filtered = complaints.filter(c => {
    if (filter.status && c.status !== filter.status) return false;
    if (filter.urgency && c.urgency !== filter.urgency) return false;
    if (filter.category && c.category !== filter.category) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!c.id.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    critical: complaints.filter(c => c.urgency === 'Critical').length,
  };

  return (
    <div className="page animate-in" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Officer Dashboard</h1>
            <p style={{ color: '#607D8B', fontSize: 14 }}>Manage and resolve citizen complaints</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }} onClick={reload}>↻ Refresh</button>
            <span className="badge badge-yellow" style={{ padding: '8px 12px' }}>
              {counts.critical} Critical
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total', value: counts.total, color: '#1A237E' },
            { label: 'Pending', value: counts.pending, color: '#E65100' },
            { label: 'In Progress', value: counts.inProgress, color: '#FF6B00' },
            { label: 'Resolved', value: counts.resolved, color: '#138808' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 12 }}>
            <input
              style={{ background: '#fff', border: '1.5px solid #C5CAE9', borderRadius: 6, padding: '9px 12px', color: '#1A237E', fontSize: 13 }}
              placeholder="Search ID, name, description…"
              value={filter.search}
              onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            />
            {[
              { key: 'status', opts: ['All Status', 'Pending', 'In Progress', 'Resolved', 'Closed'] },
              { key: 'urgency', opts: ['All Urgency', 'Critical', 'High', 'Medium', 'Low'] },
              { key: 'category', opts: ['All Category', ...CATEGORIES] },
            ].map(({ key, opts }) => (
              <select key={key}
                style={{ background: '#fff', border: '1.5px solid #C5CAE9', borderRadius: 6, padding: '9px 12px', color: filter[key] ? '#1A237E' : '#607D8B', fontSize: 13 }}
                value={filter[key]}
                onChange={e => setFilter(f => ({ ...f, [key]: e.target.value.startsWith('All') ? '' : e.target.value }))}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #C5CAE9', background: '#F0F2FF' }}>
                  {['ID', 'Citizen', 'Category', 'Urgency', 'Status', 'SLA', 'Assigned To'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#607D8B', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#607D8B' }}>No complaints match the filter.</td></tr>
                ) : filtered.map(c => (
                  <ComplaintRow key={c.id} c={c} onClick={() => setSelected(c)} />
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid #C5CAE9', fontSize: 12, color: '#607D8B' }}>
            Showing {filtered.length} of {complaints.length} complaints · Click a row to view details and update
          </div>
        </div>
      </div>

      {selected && (
        <Modal
          complaint={selected}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => {
            setComplaints(c => c.map(x => x.id === updated.id ? updated : x));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
