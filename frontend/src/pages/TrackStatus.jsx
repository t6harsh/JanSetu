import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowLeft, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import VirtualKeyboard from '../components/VirtualKeyboard';

const mockRequests = [
    { id: 'GRV-482910', type: 'Grievance', category: 'Water Leakage', date: '22 Feb 2026', status: 'in-progress', detail: 'Water leakage at Sector 18, Ward 5' },
    { id: 'PAY-TXN928412', type: 'Bill Payment', category: 'Electricity', date: '18 Feb 2026', status: 'resolved', detail: 'Electricity bill payment – ₹2,340' },
    { id: 'GRV-381729', type: 'Grievance', category: 'Streetlight Issue', date: '10 Feb 2026', status: 'resolved', detail: 'Non-functional streetlight near Block C' },
    { id: 'CON-192847', type: 'New Connection', category: 'Gas', date: '05 Feb 2026', status: 'pending', detail: 'New gas connection request for Plot 24' },
    { id: 'PAY-TXN817204', type: 'Bill Payment', category: 'Water', date: '01 Feb 2026', status: 'resolved', detail: 'Water bill payment – ₹450' },
];

const statusConfig = {
    'pending': { icon: Clock, color: '#856404', bg: '#FFF3CD', label: 'Pending' },
    'in-progress': { icon: Loader, color: '#0c5460', bg: '#D1ECF1', label: 'In Progress' },
    'resolved': { icon: CheckCircle, color: '#155724', bg: '#D4EDDA', label: 'Resolved' },
};

export default function TrackStatus() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState('');
    const [filter, setFilter] = useState('all');
    const [showKeyboard, setShowKeyboard] = useState(false);

    const filtered = mockRequests.filter(r =>
        (filter === 'all' || r.status === filter) &&
        (searchId === '' || r.id.toLowerCase().includes(searchId.toLowerCase()))
    );

    // Virtual keyboard handlers
    const handleKeyPress = (key) => {
        setSearchId(prev => prev + key);
    };
    const handleBackspace = () => {
        setSearchId(prev => prev.slice(0, -1));
    };
    const handleClear = () => setSearchId('');

    return (
        <div className="animate-fade-in">
            <div className="breadcrumb">
                <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                <span className="breadcrumb__separator">›</span>
                <span>{t('service_status')}</span>
            </div>

            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>{t('service_status')}</h1>

            {/* Search */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        value={searchId}
                        readOnly
                        onFocus={() => setShowKeyboard(true)}
                        placeholder="Search by ID (e.g. GRV-482910)"
                        style={{ paddingLeft: '2.5rem' }}
                        inputMode="none"
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
                        <button
                            key={f}
                            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter(f)}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
                        >
                            {f === 'all' ? 'All' : f.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* On-screen keyboard */}
            {showKeyboard && (
                <div className="form-keyboard-area" style={{ maxWidth: '650px', margin: '0 auto 0.75rem' }}>
                    <VirtualKeyboard
                        mode="text"
                        onKeyPress={handleKeyPress}
                        onBackspace={handleBackspace}
                        onClear={handleClear}
                    />
                    <div style={{ textAlign: 'center', marginTop: '0.4rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowKeyboard(false)}
                            style={{ padding: '0.3rem 1.5rem', fontSize: '0.8rem' }}
                        >
                            Hide Keyboard
                        </button>
                    </div>
                </div>
            )}

            {/* Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map((req) => {
                    const sc = statusConfig[req.status];
                    const StatusIcon = sc.icon;
                    return (
                        <div key={req.id} className="panel" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--corporate-blue)', fontSize: '0.95rem' }}>{req.id}</span>
                                        <span className={`status-badge status-badge--${req.status}`}>
                                            <StatusIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                            {sc.label}
                                        </span>
                                    </div>
                                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.type} — {req.category}</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{req.detail}</p>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                    <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                    {req.date}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <AlertCircle size={40} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                        <p>No requests found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
