// ── Seed data ─────────────────────────────────────────────────────────────
const SEED_COMPLAINTS = [
  {
    id: 'CMP-2024-0001',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    language: 'Hindi',
    category: 'Water Supply',
    subcategory: 'No water for 3 days',
    description: 'Our entire locality has had no water supply for the past 3 days. Multiple families are affected. We have raised this issue before but no action was taken.',
    address: 'Block C, Sector 12, Dwarka, New Delhi',
    pincode: '110075',
    urgency: 'High',
    status: 'In Progress',
    assignedTo: 'Officer Priya Sharma',
    department: 'Jal Board',
    filedOn: '2024-03-08T09:30:00',
    updatedOn: '2024-03-09T14:00:00',
    slaDeadline: '2024-03-12T09:30:00',
    updates: [
      { time: '2024-03-08T09:30:00', text: 'Complaint received and acknowledged.' },
      { time: '2024-03-08T11:00:00', text: 'AI triage complete. Assigned to Jal Board, priority: High.' },
      { time: '2024-03-09T14:00:00', text: 'Field officer dispatched to inspect the pipeline.' },
    ],
    rating: null,
  },
  {
    id: 'CMP-2024-0002',
    name: 'Sunita Devi',
    phone: '9123456780',
    language: 'Tamil',
    category: 'Road Repair',
    subcategory: 'Large pothole causing accidents',
    description: 'There is a very large pothole on the main road near the school. Two accidents have already happened. Children going to school are in danger.',
    address: 'Anna Nagar, Chennai',
    pincode: '600040',
    urgency: 'Critical',
    status: 'Resolved',
    assignedTo: 'Officer Arjun Nair',
    department: 'PWD',
    filedOn: '2024-03-05T08:00:00',
    updatedOn: '2024-03-07T17:00:00',
    slaDeadline: '2024-03-09T08:00:00',
    updates: [
      { time: '2024-03-05T08:00:00', text: 'Complaint received and acknowledged.' },
      { time: '2024-03-05T09:00:00', text: 'Flagged as Critical. Assigned to PWD.' },
      { time: '2024-03-06T10:00:00', text: 'Repair team deployed to site.' },
      { time: '2024-03-07T17:00:00', text: 'Pothole repaired. Road surface restored. Issue resolved.' },
    ],
    rating: 5,
  },
  {
    id: 'CMP-2024-0003',
    name: 'Mohammed Iqbal',
    phone: '9988776655',
    language: 'Urdu',
    category: 'Electricity',
    subcategory: 'Power outage for 12 hours',
    description: 'Our area has been experiencing a power outage since last night. Patients with medical equipment at home are at risk. Please send emergency repair team.',
    address: 'Shivaji Nagar, Pune',
    pincode: '411005',
    urgency: 'Critical',
    status: 'Pending',
    assignedTo: null,
    department: 'MSEDCL',
    filedOn: '2024-03-10T06:00:00',
    updatedOn: '2024-03-10T06:05:00',
    slaDeadline: '2024-03-11T06:00:00',
    updates: [
      { time: '2024-03-10T06:00:00', text: 'Complaint received and acknowledged.' },
      { time: '2024-03-10T06:05:00', text: 'AI triage complete. Assigned to MSEDCL, priority: Critical.' },
    ],
    rating: null,
  },
  {
    id: 'CMP-2024-0004',
    name: 'Kavya Reddy',
    phone: '9000112233',
    language: 'Telugu',
    category: 'Sanitation',
    subcategory: 'Garbage not collected for a week',
    description: 'Garbage has not been collected from our street for over a week. The pile is growing and there is a risk of disease spreading in the neighbourhood.',
    address: 'Banjara Hills, Hyderabad',
    pincode: '500034',
    urgency: 'Medium',
    status: 'In Progress',
    assignedTo: 'Officer Meera Iyer',
    department: 'GHMC',
    filedOn: '2024-03-07T15:00:00',
    updatedOn: '2024-03-09T10:00:00',
    slaDeadline: '2024-03-11T15:00:00',
    updates: [
      { time: '2024-03-07T15:00:00', text: 'Complaint received and acknowledged.' },
      { time: '2024-03-07T16:00:00', text: 'Assigned to GHMC sanitation team.' },
      { time: '2024-03-09T10:00:00', text: 'Sanitation team scheduled for pickup on 11th March.' },
    ],
    rating: null,
  },
  {
    id: 'CMP-2024-0005',
    name: 'Amit Verma',
    phone: '9876001234',
    language: 'Hindi',
    category: 'Streetlight',
    subcategory: 'No streetlights for 2 weeks',
    description: 'The entire stretch of Road No. 5 has had no streetlights for two weeks. It is unsafe for residents at night, especially women and elderly.',
    address: 'Vaishali Nagar, Jaipur',
    pincode: '302021',
    urgency: 'Medium',
    status: 'Pending',
    assignedTo: null,
    department: 'Electricity Board',
    filedOn: '2024-03-10T20:00:00',
    updatedOn: '2024-03-10T20:05:00',
    slaDeadline: '2024-03-14T20:00:00',
    updates: [
      { time: '2024-03-10T20:00:00', text: 'Complaint received and acknowledged.' },
      { time: '2024-03-10T20:05:00', text: 'AI triage complete. Assigned to Electricity Board.' },
    ],
    rating: null,
  },
];

// ── Storage helpers ───────────────────────────────────────────────────────────
const STORAGE_KEY = 'pscrm_complaints';

export function loadComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // First load - seed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COMPLAINTS));
  return SEED_COMPLAINTS;
}

export function saveComplaints(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addComplaint(c) {
  const list = loadComplaints();
  list.unshift(c);
  saveComplaints(list);
}

export function updateComplaint(id, changes) {
  const list = loadComplaints();
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...changes, updatedOn: new Date().toISOString() };
    saveComplaints(list);
    return list[idx];
  }
  return null;
}

export function getComplaint(id) {
  return loadComplaints().find(c => c.id === id) || null;
}

export function generateId() {
  const list = loadComplaints();
  const num = list.length + 1;
  return `CMP-2024-${String(num).padStart(4, '0')}`;
}

export const CATEGORIES = [
  'Water Supply', 'Road Repair', 'Electricity', 'Sanitation',
  'Streetlight', 'Drainage', 'Public Park', 'Building/Construction', 'Other'
];

export const LANGUAGES = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Bengali',
  'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Urdu', 'Punjabi', 'Odia'
];

export const URGENCY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

export const DEPT_MAP = {
  'Water Supply': 'Jal Board',
  'Road Repair': 'PWD',
  'Electricity': 'Electricity Board',
  'Sanitation': 'Municipal Corporation',
  'Streetlight': 'Electricity Board',
  'Drainage': 'Municipal Corporation',
  'Public Park': 'Parks Department',
  'Building/Construction': 'Town Planning',
  'Other': 'General Administration',
};

export function urgencyColor(u) {
  return { Critical: '#f87171', High: '#fb923c', Medium: '#FFE00F', Low: '#02C39A' }[u] || '#C8D8DB';
}

export function statusColor(s) {
  return { Resolved: '#02C39A', 'In Progress': '#FFE00F', Pending: '#fb923c', Closed: '#7A9BA3' }[s] || '#C8D8DB';
}

export function statusBadge(s) {
  return { Resolved: 'badge-green', 'In Progress': 'badge-yellow', Pending: 'badge-orange', Closed: 'badge-muted' }[s] || 'badge-muted';
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
