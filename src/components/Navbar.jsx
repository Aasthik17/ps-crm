import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/file',      label: 'File Complaint' },
    { to: '/track',     label: 'Track Complaint' },
    { to: '/officer',   label: 'Officer Dashboard' },
    { to: '/admin',     label: 'Admin Analytics' },
  ];

  return (
    <>
      {/* GoI top identification strip */}
      <div style={{
        background: '#1A237E',
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        padding: '4px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        letterSpacing: 0.2,
      }}>
        <span>🇮🇳</span>
        <span style={{ fontWeight: 600 }}>Government of India</span>
        <span style={{ color: 'rgba(255,255,255,0.45)', margin: '0 4px' }}>|</span>
        <span>भारत सरकार</span>
        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>Skip to Main Content</span>
      </div>

      {/* Saffron accent line */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #FF6B00 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)' }} />

      {/* Main nav */}
      <nav style={{
        background: '#ffffff',
        borderBottom: '2px solid #1A237E',
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(26,35,126,0.1)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 64,
        }}>
          {/* Logo / Branding */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Ashoka Chakra-inspired emblem circle */}
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A237E, #283593)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, border: '2px solid #FF6B00',
            }}>⚖️</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#1A237E', letterSpacing: 0.3 }}>
                PS<span style={{ color: '#FF6B00' }}>-CRM</span>
              </span>
              <span style={{ fontSize: 10, color: '#607D8B', fontWeight: 500, letterSpacing: 0.5 }}>
                PUBLIC SERVICE PORTAL
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 13px',
                borderRadius: 4,
                fontSize: 13,
                fontWeight: pathname === l.to ? 700 : 500,
                color: pathname === l.to ? '#FF6B00' : '#1A237E',
                background: pathname === l.to ? 'rgba(255,107,0,0.08)' : 'transparent',
                borderBottom: pathname === l.to ? '2px solid #FF6B00' : '2px solid transparent',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (pathname !== l.to) e.currentTarget.style.background = '#F0F2FF'; }}
              onMouseLeave={e => { if (pathname !== l.to) e.currentTarget.style.background = 'transparent'; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* CTA */}
          <Link to="/file" className="btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}>
            + File Complaint
          </Link>
        </div>
      </nav>
    </>
  );
}
