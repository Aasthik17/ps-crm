import { useState, useEffect } from 'react';
import { loadComplaints, urgencyColor, statusBadge, fmtDate } from '../data.js';

function BarChart({ data, colorKey }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map(d => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#37474F', minWidth: 110, textAlign: 'right' }}>{d.label}</span>
          <div style={{ flex: 1, height: 22, background: '#E8EAF6', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              height: '100%',
              width: `${(d.value / max) * 100}%`,
              background: d.color || 'linear-gradient(90deg, #1A237E, #FF6B00)',
              borderRadius: 4,
              transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
              minWidth: d.value > 0 ? 30 : 0,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8,
            }}>
              {d.value > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>{d.value}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const r = 40, cx = 60, cy = 60, stroke = 18;
  const circumference = 2 * Math.PI * r;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8EAF6" strokeWidth={stroke} />
        {total > 0 && segments.map((seg, i) => {
          const dash = (seg.value / total) * circumference;
          const gap = circumference - dash;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * circumference / total}
              style={{ transition: 'stroke-dasharray 0.8s' }}
            />
          );
          offset += seg.value;
          return el;
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }}/>
            <span style={{ fontSize: 12, color: '#37474F' }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1A237E', marginLeft: 4 }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  useEffect(() => { setComplaints(loadComplaints()); }, []);

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const critical = complaints.filter(c => c.urgency === 'Critical').length;
  const overdue = complaints.filter(c => c.status !== 'Resolved' && new Date(c.slaDeadline) < new Date()).length;
  const resRate = total ? Math.round((resolved / total) * 100) : 0;
  const avgRating = (() => {
    const rated = complaints.filter(c => c.rating);
    return rated.length ? (rated.reduce((s, c) => s + c.rating, 0) / rated.length).toFixed(1) : '—';
  })();

  // Category breakdown
  const catMap = {};
  complaints.forEach(c => { catMap[c.category] = (catMap[c.category] || 0) + 1; });
  const catData = Object.entries(catMap).sort((a,b) => b[1]-a[1]).slice(0,7).map(([label, value]) => ({ label, value }));

  // Department breakdown
  const deptMap = {};
  complaints.forEach(c => { deptMap[c.department] = (deptMap[c.department] || 0) + 1; });
  const deptData = Object.entries(deptMap).sort((a,b) => b[1]-a[1]).map(([label, value]) => ({ label, value }));

  // Status donut
  const statusSegments = [
    { label: 'Resolved',    value: resolved,   color: '#138808' },
    { label: 'In Progress', value: inProgress, color: '#FF6B00' },
    { label: 'Pending',     value: pending,    color: '#F57C00' },
  ];

  // Urgency donut
  const urgencyMap = {};
  complaints.forEach(c => { urgencyMap[c.urgency] = (urgencyMap[c.urgency] || 0) + 1; });
  const urgencySegments = ['Critical','High','Medium','Low'].map(u => ({
    label: u, value: urgencyMap[u] || 0, color: urgencyColor(u),
  }));

  // Recent complaints
  const recent = [...complaints].sort((a,b) => new Date(b.filedOn) - new Date(a.filedOn)).slice(0, 5);

  // Language breakdown
  const langMap = {};
  complaints.forEach(c => { langMap[c.language] = (langMap[c.language] || 0) + 1; });
  const langData = Object.entries(langMap).sort((a,b)=>b[1]-a[1]).map(([label, value]) => ({ label, value }));

  return (
    <div className="page animate-in" style={{ padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Admin Analytics</h1>
          <p style={{ color: '#607D8B', fontSize: 14 }}>Live overview of grievance resolution performance</p>
        </div>

        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Complaints', value: total,     color: '#1A237E' },
            { label: 'Resolution Rate',  value: `${resRate}%`, color: '#138808' },
            { label: 'Avg. CSAT',        value: avgRating === '—' ? '—' : `${avgRating}/5`, color: '#FF6B00' },
            { label: 'Critical Open',    value: critical,  color: '#f87171' },
            { label: 'SLA Breached',     value: overdue,   color: overdue > 0 ? '#C62828' : '#138808' },
            { label: 'Pending',          value: pending,   color: '#E65100' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Row 1 — Category + Status donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: '#1A237E', marginBottom: 20 }}>Complaints by Category</h3>
            <BarChart data={catData} />
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: '#1A237E', marginBottom: 20 }}>Resolution Status</h3>
            <DonutChart segments={statusSegments} />
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#7A9BA3', marginBottom: 8 }}>
                <span>Resolution Rate</span>
                <span style={{ color: '#138808', fontWeight: 700 }}>{resRate}%</span>
              </div>
              <div style={{ height: 8, background: '#E8EAF6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${resRate}%`, background: 'linear-gradient(90deg,#1A237E,#138808)', borderRadius: 4, transition: 'width 1s' }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — Department + Urgency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: '#1A237E', marginBottom: 20 }}>Complaints by Department</h3>
            <BarChart data={deptData} />
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: '#1A237E', marginBottom: 20 }}>Urgency Distribution</h3>
            <DonutChart segments={urgencySegments} />
            {overdue > 0 && (
              <div style={{ marginTop: 20, background: 'rgba(198,40,40,0.08)', border: '1px solid rgba(198,40,40,0.25)', borderRadius: 8, padding: 12 }}>
                <p style={{ fontSize: 13, color: '#C62828' }}>
                  ⚠ <strong>{overdue} complaint{overdue > 1 ? 's' : ''}</strong> {overdue > 1 ? 'have' : 'has'} breached SLA deadline and need immediate attention.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Row 3 — Language + Recent */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, color: '#1A237E', marginBottom: 20 }}>Language Distribution</h3>
            <BarChart data={langData} />
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #C5CAE9' }}>
              <h3 style={{ fontWeight: 700, color: '#1A237E' }}>Recent Complaints</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F0F2FF' }}>
                  {['ID', 'Citizen', 'Category', 'Status', 'Filed'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#607D8B', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #C5CAE9' }}>
                    <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#FF6B00' }}>{c.id}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12 }}>{c.name}</td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#37474F' }}>{c.category}</td>
                    <td style={{ padding: '10px 16px' }}><span className={`badge ${statusBadge(c.status)}`} style={{ fontSize: 10 }}>{c.status}</span></td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#607D8B' }}>{fmtDate(c.filedOn).split(',')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="card" style={{ borderTop: '3px solid #FF6B00' }}>
          <h3 style={{ fontWeight: 700, color: '#1A237E', marginBottom: 16 }}>🧠 AI-Generated Insights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
            {[
              { icon: '📈', title: 'Peak Category', text: `${catData[0]?.label || '—'} has the highest complaint volume (${catData[0]?.value || 0}). Consider proactive maintenance.` },
              { icon: '⚡', title: 'SLA Alert', text: overdue > 0 ? `${overdue} complaint(s) have breached SLA. Immediate escalation required.` : 'All complaints are within SLA. Keep it up!' },
              { icon: '🌐', title: 'Language Reach', text: `${langData.length} languages detected. Most complaints are in ${langData[0]?.label || '—'}.` },
              { icon: '⭐', title: 'Satisfaction', text: avgRating === '—' ? 'No ratings yet. Encourage citizens to rate resolved complaints.' : `Current CSAT score: ${avgRating}/5. Target: 4.5+` },
            ].map(i => (
              <div key={i.title} style={{ background: 'rgba(26,35,126,0.05)', border: '1px solid #C5CAE9', borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{i.icon}</div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#FF6B00', marginBottom: 4 }}>{i.title}</h4>
                <p style={{ fontSize: 12, color: '#37474F', lineHeight: 1.5 }}>{i.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
