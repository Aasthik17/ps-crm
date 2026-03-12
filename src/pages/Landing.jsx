import { Link } from 'react-router-dom';
import { loadComplaints } from '../data.js';

const features = [
  { icon: '📥', title: 'Omni-Channel Intake', desc: 'File complaints via web, WhatsApp, SMS, mobile app or in person - all in one place.' },
  { icon: '🧠', title: 'AI-Powered Triage', desc: 'Automatic categorisation and urgency scoring in 22 Indian languages - in under 2 seconds.' },
  { icon: '⏱️', title: 'SLA Enforcement', desc: 'Every complaint gets a deadline. Automatic escalation if an officer misses it.' },
  { icon: '📊', title: 'Live Analytics', desc: 'Real-time dashboards showing resolution rates, bottlenecks, and citizen satisfaction.' },
];

const steps = [
  { num: '01', title: 'File a Complaint', desc: 'Submit via the portal in your language. Get an instant tracking ID.' },
  { num: '02', title: 'AI Sorts It', desc: 'IndicBERT reads, categorises, and routes to the right department automatically.' },
  { num: '03', title: 'Officer Acts', desc: 'Assigned officer gets notified with a deadline. You get status updates on WhatsApp.' },
  { num: '04', title: 'Resolved', desc: 'You confirm resolution and rate the service. Data feeds into governance analytics.' },
];

export default function Landing() {
  const complaints = loadComplaints();
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;

  return (
    <div className="page animate-in">
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1A237E 0%, #283593 50%, #1A237E 100%)',
        borderBottom: '4px solid #FF6B00',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,107,0,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(19,136,8,0.10) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}/>

        <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>
          {/* Emblem area */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ height: 1, width: 60, background: 'rgba(255,153,51,0.5)' }} />
            <span style={{ fontSize: 36 }}>⚖️</span>
            <div style={{ height: 1, width: 60, background: 'rgba(255,153,51,0.5)' }} />
          </div>

          <span className="badge badge-green" style={{ marginBottom: 16, fontSize: 12 }}>
            🇮🇳 India Innovates 2026 - Smart Governance Track
          </span>

          <h1 style={{
            fontSize: 'clamp(28px,5vw,54px)',
            fontWeight: 900,
            lineHeight: 1.2,
            marginTop: 16,
            marginBottom: 16,
            color: '#ffffff',
          }}>
            Smart Public Service<br />
            <span style={{ color: '#FF9933' }}>Grievance Management</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            One platform. Every complaint. Every department. Real-time transparency for citizens and governments alike.
          </p>

          {/* Tricolour divider */}
          <div style={{ display: 'flex', height: 3, width: 180, margin: '0 auto 28px', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#FF6B00' }} />
            <div style={{ flex: 1, background: '#ffffff' }} />
            <div style={{ flex: 1, background: '#138808' }} />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/file" className="btn-primary" style={{ fontSize: 15 }}>📝 File a Complaint</Link>
            <Link to="/track" className="btn-secondary" style={{ fontSize: 15, background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>🔍 Track Status</Link>
            <Link to="/admin" className="btn-secondary" style={{ fontSize: 15, background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>📊 View Dashboard →</Link>
          </div>
        </div>
      </section>

      {/* Live stats strip */}
      <section style={{ padding: '28px 24px', background: '#F0F2FF', borderBottom: '1px solid #C5CAE9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 14 }}>
          {[
            { value: complaints.length, label: 'Total Complaints',  color: '#1A237E' },
            { value: pending,           label: 'Awaiting Action',   color: '#F57C00' },
            { value: inProgress,        label: 'In Progress',       color: '#FF6B00' },
            { value: resolved,          label: 'Resolved',          color: '#138808' },
            { value: '< 2s',            label: 'AI Triage Speed',   color: '#138808' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
              <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '64px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#1A237E', marginBottom: 8 }}>
              Why <span style={{ color: '#FF6B00' }}>PS-CRM</span>
            </h2>
            <p style={{ color: '#607D8B' }}>Built specifically for India's administrative complexity</p>
            <div style={{ display: 'flex', height: 3, width: 80, margin: '16px auto 0', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ flex: 1, background: '#FF6B00' }} />
              <div style={{ flex: 1, background: '#C5CAE9' }} />
              <div style={{ flex: 1, background: '#138808' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 20 }}>
            {features.map((f, idx) => (
              <div key={f.title} className="card"
                style={{
                  borderTop: `3px solid ${['#FF6B00','#1A237E','#138808','#FF9933'][idx]}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(26,35,126,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(26,35,126,0.07)'; }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#1A237E' }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: '#607D8B', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '64px 24px', background: '#F0F2FF', borderTop: '1px solid #C5CAE9', borderBottom: '1px solid #C5CAE9' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#1A237E', marginBottom: 8 }}>
              How It <span style={{ color: '#FF6B00' }}>Works</span>
            </h2>
            <p style={{ color: '#607D8B' }}>Four steps from complaint to resolution</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: i % 2 === 0 ? '#1A237E' : '#FF6B00',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 800, color: '#ffffff',
                  boxShadow: `0 4px 12px rgba(${i % 2 === 0 ? '26,35,126' : '255,107,0'},0.3)`,
                }}>{s.num}</div>
                <h3 style={{ fontWeight: 700, color: '#1A237E' }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: '#607D8B', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center', background: '#fff' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: '#1A237E' }}>
          Have a complaint?{' '}
          <span style={{ color: '#FF6B00' }}>We're listening.</span>
        </h2>
        <p style={{ color: '#607D8B', marginBottom: 28 }}>
          File now and track in real time - in your language.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/file" className="btn-primary">📝 File a Complaint</Link>
          <Link to="/officer" className="btn-secondary">Officer Login →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1A237E',
        borderTop: '3px solid #FF6B00',
        padding: '28px 24px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12.5,
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#FF9933', fontWeight: 700 }}>PS-CRM</span>
          {' '}· Smart Public Service Grievance Management · Government of India · India Innovates 2026
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)' }}>
          Built with React + Vite ·{' '}
          <a href="https://github.com" style={{ color: '#FF9933' }}>GitHub</a>
          {' '}· Deployed on Vercel
        </div>
      </footer>
    </div>
  );
}
