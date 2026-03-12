import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addComplaint, generateId, CATEGORIES, LANGUAGES, URGENCY_LEVELS, DEPT_MAP } from '../data.js';

const STEPS = ['Your Details', 'Complaint Info', 'Review & Submit'];

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: i < current ? '#138808' : i === current ? '#FF6B00' : '#C5CAE9',
              color: i <= current ? '#ffffff' : '#607D8B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, transition: 'all 0.3s',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i === current ? '#FF6B00' : '#607D8B', whiteSpace: 'nowrap', fontWeight: i === current ? 600 : 400 }}>
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 80, height: 2, background: i < current ? '#138808' : '#C5CAE9', margin: '0 8px', marginBottom: 22, transition: 'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function FileComplaint() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(null);

  const [form, setForm] = useState({
    name: '', phone: '', language: 'Hindi', address: '', pincode: '',
    category: '', description: '', urgency: 'Medium',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  function validate(s) {
    const e = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.match(/^\d{10}$/)) e.phone = 'Enter a valid 10-digit mobile number';
      if (!form.address.trim()) e.address = 'Address is required';
      if (!form.pincode.match(/^\d{6}$/)) e.pincode = 'Enter a valid 6-digit pincode';
    }
    if (s === 1) {
      if (!form.category) e.category = 'Please select a category';
      if (form.description.trim().length < 30) e.description = 'Please describe the issue in at least 30 characters';
    }
    return e;
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => s + 1);
  }

  function submit() {
    const id = generateId();
    const now = new Date().toISOString();
    const sla = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
    const complaint = {
      id,
      ...form,
      subcategory: form.description.slice(0, 60),
      status: 'Pending',
      assignedTo: null,
      department: DEPT_MAP[form.category] || 'General Administration',
      filedOn: now,
      updatedOn: now,
      slaDeadline: sla,
      updates: [
        { time: now, text: 'Complaint received and acknowledged. Tracking ID generated.' },
        { time: new Date(Date.now() + 30000).toISOString(), text: `AI triage complete. Categorised as "${form.category}", priority: ${form.urgency}. Forwarded to ${DEPT_MAP[form.category] || 'General Administration'}.` },
      ],
      rating: null,
    };
    addComplaint(complaint);
    setSubmitted(complaint);
  }

  if (submitted) {
    return (
      <div className="page animate-in" style={{ padding: '60px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(19,136,8,0.1)', border: '2px solid #138808',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 24px',
          }}>✓</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Complaint Filed!</h1>
          <p style={{ color: '#C8D8DB', marginBottom: 32 }}>
            Your complaint has been received and is being processed by our AI triage system.
          </p>

          <div className="card" style={{ textAlign: 'left', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: '#7A9BA3', fontSize: 13 }}>Tracking ID</span>
              <span style={{ fontWeight: 800, color: '#FF6B00', fontSize: 16 }}>{submitted.id}</span>
            </div>
            {[
              ['Category', submitted.category],
              ['Department', submitted.department],
              ['Priority', submitted.urgency],
              ['SLA Deadline', new Date(submitted.slaDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #E8EAF6' }}>
                <span style={{ color: '#607D8B', fontSize: 13 }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A237E' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(19,136,8,0.07)', border: '1px solid rgba(19,136,8,0.2)', borderRadius: 8, padding: 16, marginBottom: 28, textAlign: 'left' }}>
            <p style={{ fontSize: 13, color: '#C8D8DB', lineHeight: 1.6 }}>
              📱 You will receive status updates via SMS/WhatsApp on <strong style={{ color: '#1A237E' }}>{submitted.phone}</strong>.<br />
              Save your tracking ID to check status anytime.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate(`/track?id=${submitted.id}`)}>
              Track This Complaint
            </button>
            <button className="btn-secondary" onClick={() => { setSubmitted(null); setStep(0); setForm({ name:'',phone:'',language:'Hindi',address:'',pincode:'',category:'',description:'',urgency:'Medium' }); }}>
              File Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-in" style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>File a Complaint</h1>
        <p style={{ color: '#607D8B', marginBottom: 36 }}>All fields marked with * are required. Your complaint is confidential.</p>

        <StepIndicator current={step} />

        <div className="card animate-in" key={step}>
          {/* STEP 0 - Personal Details */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Your Details</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rajesh Kumar" />
                  {errors.name && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" maxLength={10} />
                  {errors.phone && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Language</label>
                <select value={form.language} onChange={e => set('language', e.target.value)}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Address / Locality *</label>
                <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street, Area, City" />
                {errors.address && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.address}</span>}
              </div>

              <div className="form-group" style={{ maxWidth: 200 }}>
                <label>Pincode *</label>
                <input value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="6-digit pincode" maxLength={6} />
                {errors.pincode && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.pincode}</span>}
              </div>
            </div>
          )}

          {/* STEP 1 - Complaint Info */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Complaint Details</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.category && <span style={{ fontSize: 12, color: '#f87171' }}>{errors.category}</span>}
                </div>
                <div className="form-group">
                  <label>Urgency Level</label>
                  <select value={form.urgency} onChange={e => set('urgency', e.target.value)}>
                    {URGENCY_LEVELS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {form.category && (
                <div style={{ background: 'rgba(19,136,8,0.07)', border: '1px solid rgba(19,136,8,0.2)', borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 12, color: '#138808' }}>
                    ✓ Auto-assigned to: <strong>{DEPT_MAP[form.category]}</strong>
                  </p>
                </div>
              )}

              <div className="form-group">
                <label>Describe the Issue * <span style={{ color: '#7A9BA3', fontWeight: 400 }}>(min. 30 characters)</span></label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Describe the problem in detail. The more information you provide, the faster it can be resolved."
                  rows={5}
                  style={{ resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {errors.description
                    ? <span style={{ fontSize: 12, color: '#f87171' }}>{errors.description}</span>
                    : <span />}
                  <span style={{ fontSize: 12, color: form.description.length >= 30 ? '#138808' : '#607D8B' }}>
                    {form.description.length} chars
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 - Review */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>Review Your Complaint</h2>
              <p style={{ fontSize: 13, color: '#607D8B' }}>Please review before submitting. You cannot edit after submission.</p>

              {[
                { section: 'Personal Details', items: [
                  ['Name', form.name], ['Phone', form.phone],
                  ['Language', form.language], ['Address', form.address],
                  ['Pincode', form.pincode],
                ]},
                { section: 'Complaint Info', items: [
                  ['Category', form.category], ['Urgency', form.urgency],
                  ['Routed To', DEPT_MAP[form.category] || '-'], ['Description', form.description],
                ]},
              ].map(sec => (
                <div key={sec.section} className="card" style={{ padding: 16, background: '#F0F2FF' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#FF6B00', marginBottom: 12 }}>{sec.section}</h3>
                  {sec.items.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #C5CAE9', fontSize: 13 }}>
                      <span style={{ color: '#607D8B', minWidth: 90 }}>{k}</span>
                      <span style={{ color: '#1A237E', flex: 1 }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Nav buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            {step > 0
              ? <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>
              : <span />}
            {step < STEPS.length - 1
              ? <button className="btn-primary" onClick={next}>Next →</button>
              : <button className="btn-yellow" onClick={submit}>Submit Complaint</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
