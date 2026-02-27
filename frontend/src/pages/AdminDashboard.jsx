import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Users, AlertTriangle, Clock, Monitor, CheckCircle, Loader, TrendingUp, Activity } from 'lucide-react';

const mockComplaints = [
    { id: 'GRV-482910', citizen: 'Rajesh Kumar', category: 'Water Leakage', location: 'Sector 18, Ward 5', date: '22 Feb 2026', status: 'in-progress', priority: 'High' },
    { id: 'GRV-381729', citizen: 'Priya Sharma', category: 'Streetlight Issue', location: 'Block C, MG Road', date: '20 Feb 2026', status: 'pending', priority: 'Medium' },
    { id: 'GRV-291038', citizen: 'Amit Patel', category: 'Waste Not Collected', location: 'Ward 12, Sector 7', date: '19 Feb 2026', status: 'resolved', priority: 'Low' },
    { id: 'GRV-182947', citizen: 'Sunita Devi', category: 'Road Damage', location: 'NH-48 Service Road', date: '18 Feb 2026', status: 'in-progress', priority: 'High' },
    { id: 'GRV-091827', citizen: 'Mohammad Ali', category: 'Drainage / Sewage', location: 'Old City, Ward 3', date: '15 Feb 2026', status: 'pending', priority: 'High' },
    { id: 'GRV-082716', citizen: 'Lakshmi Nair', category: 'Power Outage', location: 'Sector 22, Phase 2', date: '14 Feb 2026', status: 'resolved', priority: 'Medium' },
];

const hourlyData = [
    { hour: '8 AM', value: 45 }, { hour: '9 AM', value: 82 }, { hour: '10 AM', value: 120 },
    { hour: '11 AM', value: 105 }, { hour: '12 PM', value: 78 }, { hour: '1 PM', value: 55 },
    { hour: '2 PM', value: 92 }, { hour: '3 PM', value: 110 }, { hour: '4 PM', value: 95 },
    { hour: '5 PM', value: 60 },
];

export default function AdminDashboard() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');

    const maxVal = Math.max(...hourlyData.map(d => d.value));

    return (
        <div className="animate-fade-in">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('admin_title')}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Real-time monitoring and management console</p>

            {/* Stat Cards */}
            <div className="admin-grid stagger-children">
                <div className="admin-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <TrendingUp size={20} color="var(--corporate-blue)" />
                    </div>
                    <div className="admin-stat-card__value">12,847</div>
                    <div className="admin-stat-card__label">{t('total_transactions')}</div>
                </div>
                <div className="admin-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Monitor size={20} color="var(--success)" />
                    </div>
                    <div className="admin-stat-card__value" style={{ color: 'var(--success)' }}>24</div>
                    <div className="admin-stat-card__label">{t('active_kiosks')}</div>
                </div>
                <div className="admin-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={20} color="var(--warning)" />
                    </div>
                    <div className="admin-stat-card__value" style={{ color: '#D69E2E' }}>38</div>
                    <div className="admin-stat-card__label">{t('pending_complaints')}</div>
                </div>
                <div className="admin-stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Clock size={20} color="var(--info)" />
                    </div>
                    <div className="admin-stat-card__value" style={{ color: 'var(--info)' }}>2.4h</div>
                    <div className="admin-stat-card__label">{t('avg_resolution')}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                {['overview', 'complaints', 'reports', 'content'].map((tab) => (
                    <button
                        key={tab}
                        className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab === 'overview' ? t('admin_overview') :
                            tab === 'complaints' ? t('admin_complaints') :
                                tab === 'reports' ? t('admin_reports') :
                                    t('admin_content')}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="animate-fade-in">
                    <div className="panel" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={18} color="var(--corporate-blue)" /> Kiosk Usage Today (Hourly)
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '180px', padding: '0 0.5rem' }}>
                            {hourlyData.map((d, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.value}</span>
                                    <div style={{
                                        width: '100%',
                                        height: `${(d.value / maxVal) * 140}px`,
                                        background: `linear-gradient(180deg, var(--cyan-aadhaar) 0%, var(--corporate-blue) 100%)`,
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.6s ease',
                                        minHeight: '8px',
                                    }}></div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d.hour}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Service Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { name: 'Electricity', txns: 4821, revenue: '₹48.2L', color: '#FF9933' },
                            { name: 'Water', txns: 3210, revenue: '₹14.4L', color: '#0B5394' },
                            { name: 'Gas', txns: 2108, revenue: '₹18.8L', color: '#E53E3E' },
                        ].map((s) => (
                            <div key={s.name} className="panel" style={{ textAlign: 'center' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, margin: '0 auto 0.5rem' }}></div>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{s.name}</h4>
                                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--corporate-blue)', margin: '0.25rem 0' }}>{s.txns.toLocaleString()}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Transactions | Revenue: {s.revenue}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'complaints' && (
                <div className="panel animate-fade-in">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Citizen</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockComplaints.map((c) => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--corporate-blue)' }}>{c.id}</td>
                                    <td>{c.citizen}</td>
                                    <td>{c.category}</td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.location}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{c.date}</td>
                                    <td>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                            background: c.priority === 'High' ? '#FFF5F5' : c.priority === 'Medium' ? '#FFF3CD' : '#E6FFED',
                                            color: c.priority === 'High' ? '#E53E3E' : c.priority === 'Medium' ? '#856404' : '#28A745',
                                        }}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-badge--${c.status}`}>
                                            {c.status === 'resolved' ? <><CheckCircle size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />Resolved</> :
                                                c.status === 'in-progress' ? <><Loader size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />In Progress</> :
                                                    <><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />Pending</>}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    {[
                        { title: 'Daily Usage Report', desc: 'Kiosk interactions, peak hours, and session durations', date: '27 Feb 2026' },
                        { title: 'Revenue Collection Report', desc: 'Bill payments collected across all services', date: '27 Feb 2026' },
                        { title: 'Grievance Resolution Report', desc: 'Complaint status, resolution times, and trends', date: '26 Feb 2026' },
                        { title: 'Service Uptime Report', desc: 'Kiosk availability, downtime, and maintenance logs', date: '25 Feb 2026' },
                    ].map((r) => (
                        <div key={r.title} className="panel" style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <BarChart3 size={24} color="var(--corporate-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{r.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{r.desc}</p>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                        Generated: {r.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'content' && (
                <div className="animate-fade-in">
                    <div className="panel" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Push Alerts to Kiosks</h3>
                        <div className="form-group">
                            <label>Alert Type</label>
                            <select defaultValue="">
                                <option value="" disabled>Select alert type</option>
                                <option>Power Outage Advisory</option>
                                <option>Water Supply Disruption</option>
                                <option>Weather Alert</option>
                                <option>Construction Notice</option>
                                <option>General Announcement</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Alert Message</label>
                            <textarea rows={3} placeholder="Enter the alert message to display on kiosk idle screens..." />
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-primary">Publish to All Kiosks</button>
                            <button className="btn btn-secondary">Schedule</button>
                        </div>
                    </div>

                    <div className="panel">
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Active Alerts</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { msg: 'Scheduled water supply interruption in Sector 12-18 on 28 Feb, 10 AM – 4 PM', type: 'Water Supply Disruption', time: '2h ago' },
                                { msg: 'Heavy rainfall expected in the city. Citizens advised to avoid waterlogged areas.', type: 'Weather Alert', time: '5h ago' },
                            ].map((alert, i) => (
                                <div key={i} style={{ padding: '0.85rem 1rem', background: 'var(--warning-bg)', borderRadius: 'var(--border-radius-sm)', border: '1px solid rgba(255, 193, 7, 0.3)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#856404' }}>{alert.type}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alert.time}</span>
                                    </div>
                                    <p style={{ fontSize: '0.88rem' }}>{alert.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
