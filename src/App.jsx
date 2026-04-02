import { useState, useEffect, useCallback } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);

const C = {
  navy: "#1a2a5e", navyLight: "#243574", navyDark: "#111d42",
  blue: "#2fa4e7", blueLight: "#e8f4fd", blueMuted: "#b8ddf5",
  red: "#d42027", redLight: "#fdeaea", redMuted: "#f0a0a3",
  gold: "#f5a623", goldLight: "#fef6e5",
  white: "#ffffff", offWhite: "#f4f7fb",
  g100: "#eef1f6", g200: "#dce1ea", g400: "#9aa3b5", g600: "#5c6478", g800: "#2d3344",
  green: "#1d8348", greenLight: "#e6f5ed",
};

function fmt(a) { return new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0 }).format(a); }
function fmtDate(d) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }

async function api(path, opts = {}) {
  const r = await fetch(`/api${path}`, { headers: { "Content-Type": "application/json" }, ...opts, body: opts.body ? JSON.stringify(opts.body) : undefined });
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `API error ${r.status}`); }
  return r.json();
}

// ─── RESPONSIVE CSS ───
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: ${C.blueMuted}; border-radius: 3px; }
input[type=number]::-webkit-inner-spin-button { opacity: 1; }

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
@keyframes pulse { 0%,100%{ opacity:1 } 50%{ opacity:.5 } }

.app { min-height: 100vh; background: ${C.offWhite}; font-family: 'Poppins', sans-serif; }

/* ── HEADER ── */
.header { background: linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%); color: ${C.white}; border-bottom: 3px solid ${C.red}; }
.header-inner { max-width: 920px; margin: 0 auto; padding: 16px 16px 0; }
.header-top { display: flex; align-items: center; gap: 12px; }
.header-logo { width: 48px; height: 48px; object-fit: contain; border-radius: 10px; background: ${C.white}; padding: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); flex-shrink: 0; }
.header-title-wrap { flex: 1; min-width: 0; }
.header-title { font-size: 17px; font-weight: 800; letter-spacing: 0.02em; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-subtitle { font-size: 11px; color: ${C.blueMuted}; font-weight: 500; margin-top: 1px; }
.header-selectors { display: flex; gap: 6px; flex-shrink: 0; }
.header-select { padding: 7px 10px; border-radius: 8px; border: 1px solid ${C.navyLight}; background: ${C.navyLight}; color: ${C.white}; font-size: 12px; font-family: 'Poppins', sans-serif; font-weight: 600; }

/* ── NAV ── */
.nav-wrap { max-width: 920px; margin: 0 auto; padding: 10px 16px 0; display: flex; gap: 2px; }
.nav-btn { padding: 10px 16px; border-radius: 10px 10px 0 0; border: none; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 6px; transition: all 0.2s; background: transparent; color: ${C.blueMuted}; border-bottom: 2px solid transparent; white-space: nowrap; }
.nav-btn.active { background: ${C.offWhite}; color: ${C.navy}; border-bottom-color: ${C.red}; }
.nav-btn:hover:not(.active) { background: ${C.navyLight}; }

/* ── CONTENT ── */
.content { max-width: 920px; margin: 0 auto; padding: 20px 16px 40px; }

/* ── STATS GRID ── */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.stat-card { background: ${C.white}; border-radius: 14px; padding: 18px 16px; box-shadow: 0 2px 8px rgba(26,42,94,0.07); border: 1px solid ${C.g200}; position: relative; overflow: hidden; }
.stat-icon { position: absolute; top: -6px; right: -6px; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.stat-label { font-size: 11px; font-weight: 700; color: ${C.g400}; letter-spacing: 0.06em; text-transform: uppercase; }
.stat-value { font-size: 24px; font-weight: 700; margin-top: 4px; }
.stat-sub { font-size: 11px; color: ${C.g400}; margin-top: 2px; }

/* ── CARDS ── */
.card { background: ${C.white}; border-radius: 14px; padding: 20px; border: 1px solid ${C.g200}; box-shadow: 0 2px 8px rgba(26,42,94,0.05); margin-bottom: 16px; }
.student-row { background: ${C.white}; border-radius: 12px; padding: 14px 16px; border: 1px solid ${C.g200}; box-shadow: 0 1px 4px rgba(26,42,94,0.04); display: flex; justify-content: space-between; align-items: center; gap: 10px; transition: box-shadow 0.2s; border-left: 3px solid ${C.g200}; }
.student-row:hover { box-shadow: 0 3px 12px rgba(26,42,94,0.1); }
.student-info { flex: 1; min-width: 0; }
.student-name { font-size: 15px; font-weight: 700; color: ${C.navy}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.student-meta { font-size: 12px; color: ${C.g400}; margin-top: 2px; }
.student-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.payment-row { background: ${C.white}; border-radius: 12px; padding: 12px 16px; border: 1px solid ${C.g200}; display: flex; justify-content: space-between; align-items: center; gap: 8px; transition: box-shadow 0.2s; }
.payment-row:hover { box-shadow: 0 3px 12px rgba(26,42,94,0.1); }

.pending-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
.pending-item:not(:last-child) { border-bottom: 1px solid ${C.g100}; }
.pending-actions { display: flex; align-items: center; gap: 8px; }

/* ── TOOLBAR ── */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 10px; }
.search-wrap { position: relative; flex: 1; max-width: 300px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; color: ${C.g400}; }
.search-input { width: 100%; padding: 10px 14px 10px 36px; border: 1.5px solid ${C.g200}; border-radius: 10px; font-size: 14px; background: ${C.white}; outline: none; font-family: 'Poppins', sans-serif; }
.search-input:focus { border-color: ${C.blue}; }

/* ── MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(17,29,66,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease; }
.modal-box { background: ${C.white}; border-radius: 16px; padding: 24px 24px 20px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(17,29,66,0.25); border: 1px solid ${C.g200}; animation: slideUp 0.25s ease; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.modal-title { font-size: 17px; font-weight: 700; color: ${C.navy}; }
.modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: ${C.g400}; padding: 4px 8px; }

/* ── FOOTER ── */
.footer { text-align: center; padding: 20px 16px 30px; border-top: 1px solid ${C.g200}; font-size: 11px; color: ${C.g400}; }

/* ── BADGE ── */
.badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }

/* ── BUTTONS ── */
.btn { padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.2s; letter-spacing: 0.02em; border: none; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-primary { background: ${C.navy}; color: ${C.white}; }
.btn-secondary { background: transparent; color: ${C.g600}; border: 1.5px solid ${C.g200}; }
.btn-danger { background: ${C.red}; color: ${C.white}; }
.btn-success { background: ${C.green}; color: ${C.white}; }
.btn-blue { background: ${C.blue}; color: ${C.white}; }
.btn-sm { padding: 6px 14px; font-size: 12px; }
.btn-xs { padding: 5px 10px; font-size: 12px; }

/* ── INPUT ── */
.input-group { margin-bottom: 14px; }
.input-label { display: block; font-size: 12px; font-weight: 600; color: ${C.g600}; margin-bottom: 5px; letter-spacing: 0.03em; }
.input-field { width: 100%; padding: 10px 12px; border: 1.5px solid ${C.g200}; border-radius: 10px; font-size: 14px; background: ${C.white}; color: ${C.g800}; outline: none; font-family: 'Poppins', sans-serif; transition: border-color 0.2s; }
.input-field:focus { border-color: ${C.blue}; }

/* ── TOAST ── */
.toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 2000; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; box-shadow: 0 4px 20px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 10px; animation: slideUp 0.25s ease; color: #fff; }

/* ── TOTALS BAR ── */
.totals-bar { padding: 14px 16px; border-radius: 12px; background: linear-gradient(135deg, ${C.navy}, ${C.navyLight}); display: flex; justify-content: space-between; font-weight: 700; color: ${C.white}; font-size: 14px; }

/* ═══════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
   ═══════════════════════════════════════════════ */

/* Tablet & below */
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .stat-value { font-size: 22px; }
  .header-title { font-size: 15px; }
  .nav-btn { padding: 9px 12px; font-size: 12px; flex: 1; justify-content: center; }
  .nav-wrap { gap: 2px; }
  .student-row { flex-direction: column; align-items: flex-start; }
  .student-actions { width: 100%; justify-content: flex-start; margin-top: 8px; padding-top: 8px; border-top: 1px solid ${C.g100}; }
  .pending-item { flex-direction: column; align-items: flex-start; gap: 8px; }
  .pending-actions { width: 100%; justify-content: flex-end; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .search-wrap { max-width: 100%; }
}

/* Mobile small */
@media (max-width: 480px) {
  .header-inner { padding: 12px 12px 0; }
  .header-logo { width: 40px; height: 40px; border-radius: 8px; }
  .header-title { font-size: 14px; }
  .header-subtitle { font-size: 10px; }
  .header-select { padding: 6px 8px; font-size: 11px; }
  .nav-wrap { padding: 8px 12px 0; }
  .nav-btn { padding: 8px 6px; font-size: 11px; gap: 4px; }
  .nav-btn .nav-icon { font-size: 13px; }
  .content { padding: 14px 12px 30px; }
  .stats-grid { gap: 8px; }
  .stat-card { padding: 14px 12px; }
  .stat-value { font-size: 20px; }
  .stat-label { font-size: 10px; }
  .card { padding: 14px; }
  .student-row { padding: 12px; }
  .student-actions { gap: 6px; }
  .btn-sm, .btn-xs { padding: 6px 10px; font-size: 11px; }
  .modal-box { padding: 20px 16px 16px; margin: 8px; }
  .totals-bar { padding: 12px 14px; font-size: 13px; }
}

/* Tiny screens */
@media (max-width: 360px) {
  .header-top { flex-wrap: wrap; }
  .header-selectors { width: 100%; justify-content: flex-end; margin-top: 4px; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .stat-icon { display: none; }
}
`;

// ─── Components ───

function StatCard({ label, value, accent, sub, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: accent ? `${accent}15` : `${C.navy}10` }}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent || C.navy }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input className="input-field" {...props} />
    </div>
  );
}

function Btn({ children, variant = "primary", size, className = "", ...props }) {
  const sizeClass = size === "sm" ? "btn-sm" : size === "xs" ? "btn-xs" : "";
  return <button className={`btn btn-${variant} ${sizeClass} ${className}`} {...props}>{children}</button>;
}

function Badge({ status }) {
  const m = { paid: { bg: C.greenLight, color: C.green, text: "Paid" }, unpaid: { bg: C.redLight, color: C.red, text: "Unpaid" }, partial: { bg: C.goldLight, color: "#b87a00", text: "Partial" } };
  const s = m[status] || m.unpaid;
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{s.text}</span>;
}

function Toast({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className="toast" style={{ background: type === "error" ? C.red : C.green }}>
      {message}
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 }}>✕</button>
    </div>
  );
}

// ─── Main App ───

export default function App() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("dashboard");
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: "", class: "", feeAmount: "" });
  const [payForm, setPayForm] = useState({ amount: "", date: "", note: "" });

  const showToast = (msg, type = "success") => { setToast({ message: msg, type }); setTimeout(() => setToast({ message: "", type: "" }), 3000); };

  const fetchStudents = useCallback(async () => { try { setStudents(await api("/students")); } catch (e) { showToast(e.message, "error"); } }, []);
  const fetchPayments = useCallback(async () => { try { setPayments(await api(`/payments?month=${selectedMonth}&year=${selectedYear}`)); } catch (e) { showToast(e.message, "error"); } }, [selectedMonth, selectedYear]);

  useEffect(() => { (async () => { setLoading(true); await Promise.all([fetchStudents(), fetchPayments()]); setLoading(false); })(); }, [fetchStudents, fetchPayments]);

  const addStudentFn = async () => {
    if (!newStudent.name.trim() || !newStudent.feeAmount) return; setSaving(true);
    try { await api("/students", { method: "POST", body: { name: newStudent.name, class: newStudent.class, feeAmount: Number(newStudent.feeAmount) } }); await fetchStudents(); setNewStudent({ name: "", class: "", feeAmount: "" }); setAddStudentOpen(false); showToast("Student added"); } catch (e) { showToast(e.message, "error"); } setSaving(false);
  };
  const updateStudentFn = async () => {
    if (!editStudent?.name?.trim()) return; setSaving(true);
    try { await api(`/students/${editStudent._id}`, { method: "PUT", body: { name: editStudent.name, class: editStudent.class, feeAmount: Number(editStudent.feeAmount) } }); await fetchStudents(); setEditStudent(null); showToast("Student updated"); } catch (e) { showToast(e.message, "error"); } setSaving(false);
  };
  const deleteStudentFn = async (id) => {
    setSaving(true);
    try { await api(`/students/${id}`, { method: "DELETE" }); await Promise.all([fetchStudents(), fetchPayments()]); setConfirmDelete(null); showToast("Student removed"); } catch (e) { showToast(e.message, "error"); } setSaving(false);
  };
  const recordPaymentFn = async () => {
    if (!paymentModal || !payForm.amount) return; const st = students.find(s => s._id === paymentModal.studentId); setSaving(true);
    try { await api("/payments", { method: "POST", body: { studentId: paymentModal.studentId, month: selectedMonth, year: selectedYear, amount: Number(payForm.amount), date: payForm.date || new Date().toISOString().split("T")[0], note: payForm.note, expectedAmount: st?.feeAmount || 0 } }); await fetchPayments(); setPayForm({ amount: "", date: "", note: "" }); setPaymentModal(null); showToast("Payment recorded"); } catch (e) { showToast(e.message, "error"); } setSaving(false);
  };
  const deletePaymentFn = async (id) => { try { await api(`/payments/${id}`, { method: "DELETE" }); await fetchPayments(); showToast("Payment deleted"); } catch (e) { showToast(e.message, "error"); } };

  const getSP = (sid) => {
    const pays = payments.filter(p => p.studentId === sid);
    const total = pays.reduce((s, p) => s + p.amount, 0);
    const st = students.find(s => s._id === sid);
    const exp = st?.feeAmount || 0;
    return { total, expected: exp, status: total >= exp ? "paid" : total > 0 ? "partial" : "unpaid" };
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.class || "").toLowerCase().includes(search.toLowerCase()));
  const totalExp = students.reduce((s, st) => s + (st.feeAmount || 0), 0);
  const totalCol = payments.reduce((s, p) => s + p.amount, 0);
  const paidN = students.filter(s => getSP(s._id).status === "paid").length;
  const unpaidN = students.length - paidN;
  const pct = Math.round(totalExp ? (totalCol / totalExp) * 100 : 0);

  if (loading) return (
    <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <style>{STYLES}</style>
      <div style={{ textAlign: "center" }}>
        <img src="/logo.png" alt="Noor-ul-Islam School" style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 12, animation: "pulse 1.5s ease infinite" }} />
        <div style={{ color: C.navy, fontSize: 14, fontWeight: 600 }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <style>{STYLES}</style>

      {/* ═══ HEADER ═══ */}
      <div className="header">
        <div className="header-inner">
          <div className="header-top">
            <img className="header-logo" src="/logo.png" alt="Logo" />
            <div className="header-title-wrap">
              <div className="header-title">Noor-ul-Islam School</div>
              <div className="header-subtitle">Fee Management System</div>
            </div>
            <div className="header-selectors">
              <select className="header-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select className="header-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="nav-wrap">
          {[{ key: "dashboard", label: "Dashboard", icon: "📊" }, { key: "students", label: "Students", icon: "👨‍🎓" }, { key: "payments", label: "Payments", icon: "💰" }].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)} className={`nav-btn ${view === tab.key ? "active" : ""}`}>
              <span className="nav-icon">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="content">
        {/* ═══ DASHBOARD ═══ */}
        {view === "dashboard" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.g600, background: C.blueLight, padding: "5px 12px", borderRadius: 6, display: "inline-block" }}>
                📅 {FULL_MONTHS[selectedMonth]} {selectedYear}
              </span>
            </div>

            <div className="stats-grid">
              <StatCard label="Expected" value={fmt(totalExp)} icon="🎯" />
              <StatCard label="Collected" value={fmt(totalCol)} accent={C.green} icon="✅" sub={`${pct}% of target`} />
              <StatCard label="Paid" value={paidN} accent={C.green} icon="👍" sub="students" />
              <StatCard label="Unpaid" value={unpaidN} accent={unpaidN > 0 ? C.red : C.green} icon="⏳" sub="students" />
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.g600 }}>Collection Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{pct}%</span>
              </div>
              <div style={{ height: 12, background: C.g100, borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 6, transition: "width 0.6s ease", width: `${Math.min(100, pct)}%`, background: pct >= 80 ? `linear-gradient(90deg, ${C.green}, #27ae60)` : pct >= 50 ? `linear-gradient(90deg, ${C.blue}, #3bb5f0)` : `linear-gradient(90deg, ${C.red}, #e74c3c)` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: C.g400 }}>
                <span>{fmt(totalCol)} collected</span><span>{fmt(totalExp - totalCol)} remaining</span>
              </div>
            </div>

            {unpaidN > 0 && (
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ background: C.redLight, padding: "4px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, color: C.red }}>{unpaidN}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Pending Payments</h3>
                </div>
                {students.filter(s => getSP(s._id).status !== "paid").map(s => {
                  const sp = getSP(s._id);
                  return (
                    <div className="pending-item" key={s._id}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.g800 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: C.g400 }}>{s.class} · Due: {fmt(s.feeAmount - sp.total)}</div>
                      </div>
                      <div className="pending-actions">
                        <Badge status={sp.status} />
                        <Btn variant="blue" size="sm" onClick={() => { setPayForm({ amount: s.feeAmount - sp.total, date: new Date().toISOString().split("T")[0], note: "" }); setPaymentModal({ studentId: s._id }); }}>Collect</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {students.length === 0 && (
              <div style={{ textAlign: "center", padding: 50, color: C.g400 }}>
                <img src="/logo.png" alt="" style={{ width: 70, height: 70, objectFit: "contain", opacity: 0.3, marginBottom: 12 }} />
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: C.navy }}>No students enrolled yet</div>
                <div style={{ fontSize: 13, marginBottom: 16 }}>Add your first student to start tracking fees</div>
                <Btn onClick={() => { setView("students"); setAddStudentOpen(true); }}>+ Add Student</Btn>
              </div>
            )}
          </div>
        )}

        {/* ═══ STUDENTS ═══ */}
        {view === "students" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="toolbar">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Btn onClick={() => setAddStudentOpen(true)}>+ Add Student</Btn>
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: C.g400, fontSize: 14 }}>{students.length === 0 ? "No students added yet." : "No match found."}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map(s => {
                  const sp = getSP(s._id);
                  return (
                    <div className="student-row" key={s._id} style={{ borderLeftColor: sp.status === "paid" ? C.green : sp.status === "partial" ? C.gold : C.red }}>
                      <div className="student-info">
                        <div className="student-name">{s.name}</div>
                        <div className="student-meta">{s.class ? `${s.class} · ` : ""}Fee: {fmt(s.feeAmount)}</div>
                      </div>
                      <div className="student-actions">
                        <Badge status={sp.status} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, minWidth: 70, textAlign: "right" }}>{fmt(sp.total)}</span>
                        <Btn variant="blue" size="xs" onClick={() => { setPayForm({ amount: Math.max(0, s.feeAmount - sp.total), date: new Date().toISOString().split("T")[0], note: "" }); setPaymentModal({ studentId: s._id }); }}>Pay</Btn>
                        <Btn variant="secondary" size="xs" onClick={() => setEditStudent({ ...s })}>✏️</Btn>
                        <Btn variant="secondary" size="xs" style={{ color: C.red, borderColor: C.redMuted }} onClick={() => setConfirmDelete(s)}>🗑</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ PAYMENTS ═══ */}
        {view === "payments" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{FULL_MONTHS[selectedMonth]} {selectedYear}</h3>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.g400 }}>{payments.length} record{payments.length !== 1 ? "s" : ""}</span>
            </div>
            {payments.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: C.g400, fontSize: 14 }}>No payments recorded for this month.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[...payments].sort((a, b) => new Date(b.date) - new Date(a.date)).map(p => {
                  const st = students.find(s => s._id === p.studentId);
                  return (
                    <div className="payment-row" key={p._id}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{st?.name || "Unknown"}</div>
                        <div style={{ fontSize: 12, color: C.g400 }}>{fmtDate(p.date)}{p.note ? ` · ${p.note}` : ""}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.green }}>{fmt(p.amount)}</span>
                        <button onClick={() => deletePaymentFn(p._id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: C.g400, padding: 4 }}>✕</button>
                      </div>
                    </div>
                  );
                })}
                <div className="totals-bar"><span>Total Collected</span><span>{fmt(totalCol)}</span></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="footer">Noor-ul-Islam School · Fee Management System</div>

      {/* ═══ MODALS ═══ */}
      <Modal open={addStudentOpen} onClose={() => setAddStudentOpen(false)} title="Add New Student">
        <InputField label="Student Name" placeholder="e.g. Ahmed Ali" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} />
        <InputField label="Class / Grade" placeholder="e.g. Grade 5-A" value={newStudent.class} onChange={e => setNewStudent({ ...newStudent, class: e.target.value })} />
        <InputField label="Monthly Fee (PKR)" type="number" placeholder="e.g. 5000" value={newStudent.feeAmount} onChange={e => setNewStudent({ ...newStudent, feeAmount: e.target.value })} />
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <Btn onClick={addStudentFn} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Add Student"}</Btn>
          <Btn variant="secondary" onClick={() => setAddStudentOpen(false)}>Cancel</Btn>
        </div>
      </Modal>

      <Modal open={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student">
        {editStudent && <>
          <InputField label="Student Name" value={editStudent.name} onChange={e => setEditStudent({ ...editStudent, name: e.target.value })} />
          <InputField label="Class / Grade" value={editStudent.class} onChange={e => setEditStudent({ ...editStudent, class: e.target.value })} />
          <InputField label="Monthly Fee (PKR)" type="number" value={editStudent.feeAmount} onChange={e => setEditStudent({ ...editStudent, feeAmount: e.target.value })} />
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <Btn onClick={updateStudentFn} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Save Changes"}</Btn>
            <Btn variant="secondary" onClick={() => setEditStudent(null)}>Cancel</Btn>
          </div>
        </>}
      </Modal>

      <Modal open={!!paymentModal} onClose={() => setPaymentModal(null)} title={`Record Payment — ${students.find(s => s._id === paymentModal?.studentId)?.name || ""}`}>
        {paymentModal && <>
          <InputField label="Amount (PKR)" type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} />
          <InputField label="Date" type="date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })} />
          <InputField label="Note (optional)" placeholder="e.g. Paid via JazzCash" value={payForm.note} onChange={e => setPayForm({ ...payForm, note: e.target.value })} />
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <Btn variant="blue" onClick={recordPaymentFn} disabled={saving} style={{ flex: 1 }}>{saving ? "Saving..." : "Record Payment"}</Btn>
            <Btn variant="secondary" onClick={() => setPaymentModal(null)}>Cancel</Btn>
          </div>
        </>}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Student?">
        {confirmDelete && <div>
          <p style={{ fontSize: 14, color: C.g600, marginBottom: 18 }}>This will permanently remove <strong>{confirmDelete.name}</strong> and all their payment records.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="danger" onClick={() => deleteStudentFn(confirmDelete._id)} disabled={saving} style={{ flex: 1 }}>{saving ? "Deleting..." : "Yes, Delete"}</Btn>
            <Btn variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Btn>
          </div>
        </div>}
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "" })} />
    </div>
  );
}
