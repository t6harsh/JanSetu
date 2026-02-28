import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquareWarning, ArrowLeft, CheckCircle, Upload, Home, MapPin } from 'lucide-react';
import VirtualKeyboard from '../components/VirtualKeyboard';

const categories = [
    'cat_water_leak', 'cat_power_outage', 'cat_waste_collection',
    'cat_road_damage', 'cat_streetlight', 'cat_drainage', 'cat_other',
];

export default function GrievanceForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [grievanceId, setGrievanceId] = useState('');
    const [activeField, setActiveField] = useState('description'); // 'description' or 'location'

    const handleSubmit = () => {
        if (!category || !description.trim() || !location.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setGrievanceId(`GRV-${Date.now().toString().slice(-6)}`);
            setStep(3);
        }, 1800);
    };

    const steps = [
        { label: t('grievance_category') },
        { label: t('grievance_description') },
        { label: t('confirm') },
    ];

    // Virtual keyboard handlers
    const handleKeyPress = (key) => {
        if (activeField === 'description') {
            setDescription(prev => prev + key);
        } else {
            setLocation(prev => prev + key);
        }
    };
    const handleBackspace = () => {
        if (activeField === 'description') {
            setDescription(prev => prev.slice(0, -1));
        } else {
            setLocation(prev => prev.slice(0, -1));
        }
    };
    const handleClear = () => {
        if (activeField === 'description') setDescription('');
        else setLocation('');
    };

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                <span className="breadcrumb__separator">›</span>
                <span>{t('grievance_title')}</span>
            </div>

            {/* Progress Tracker */}
            <div className="progress-tracker">
                {steps.map((s, i) => (
                    <div key={i} className={`progress-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'completed' : ''}`}>
                        {i > 0 && <div className="progress-step__line"></div>}
                        <div className="progress-step__circle">{step > i + 1 ? '✓' : i + 1}</div>
                    </div>
                ))}
            </div>

            {/* Step 1: Category Selection */}
            {step === 1 && (
                <div className="panel animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto' }}>
                    <div className="panel__header">
                        <MessageSquareWarning size={24} color="var(--warning)" />
                        <h2 className="panel__title">{t('grievance_category')}</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                        {categories.map((cat) => (
                            <div
                                key={cat}
                                className={`language-card ${category === cat ? 'selected' : ''}`}
                                onClick={() => setCategory(cat)}
                                style={{ textAlign: 'left', padding: '1rem' }}
                            >
                                <div className="language-card__native" style={{ fontSize: '0.95rem' }}>{t(cat)}</div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="btn btn-primary btn-block btn-lg"
                        onClick={() => category && setStep(2)}
                        disabled={!category}
                        style={{ marginTop: '1.5rem' }}
                    >
                        {t('next')}
                    </button>
                </div>
            )}

            {/* Step 2: Description & Location */}
            {step === 2 && (
                <div className="panel animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
                    <div className="panel__header">
                        <MessageSquareWarning size={24} color="var(--warning)" />
                        <h2 className="panel__title">{t('grievance_description')}</h2>
                    </div>

                    <div style={{ marginBottom: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--info-bg)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.85rem', color: '#0c5460' }}>
                        {t('category_label')}: <strong>{t(category)}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '280px' }}>
                            <div className="form-group">
                                <label htmlFor="grievance-desc">{t('grievance_description')}</label>
                                <textarea
                                    id="grievance-desc"
                                    value={description}
                                    readOnly
                                    rows={3}
                                    placeholder={t('describe_issue_placeholder')}
                                    style={{ resize: 'none', border: activeField === 'description' ? '2px solid #0B5394' : undefined }}
                                    onFocus={() => setActiveField('description')}
                                    inputMode="none"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="grievance-loc">
                                    <MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                                    {t('grievance_location')}
                                </label>
                                <input
                                    id="grievance-loc"
                                    type="text"
                                    value={location}
                                    readOnly
                                    placeholder={t('ward_placeholder')}
                                    style={{ border: activeField === 'location' ? '2px solid #0B5394' : undefined }}
                                    onFocus={() => setActiveField('location')}
                                    inputMode="none"
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('attach_photo')}</label>
                                <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <Upload size={20} style={{ marginBottom: '0.25rem' }} />
                                    <p style={{ fontSize: '0.82rem' }}>{t('tap_upload_photo')}</p>
                                </div>
                            </div>
                        </div>

                        {/* On-screen keyboard */}
                        <div style={{ flex: '1 1 340px', minWidth: '320px' }}>
                            <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className={`btn ${activeField === 'description' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setActiveField('description')}
                                    style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                >
                                    {t('description_label')}
                                </button>
                                <button
                                    className={`btn ${activeField === 'location' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setActiveField('location')}
                                    style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                >
                                    {t('location_label')}
                                </button>
                            </div>
                            <VirtualKeyboard
                                mode="text"
                                onKeyPress={handleKeyPress}
                                onBackspace={handleBackspace}
                                onClear={handleClear}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn btn-secondary" onClick={() => setStep(1)}>
                            <ArrowLeft size={16} /> {t('back')}
                        </button>
                        <button
                            className="btn btn-success"
                            style={{ flex: 1 }}
                            onClick={handleSubmit}
                            disabled={loading || !description.trim() || !location.trim()}
                        >
                            {loading ? t('submitting') : <>{t('submit_grievance')}</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="panel animate-scale-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="success-screen">
                        <div className="success-screen__icon">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="success-screen__title">{t('grievance_success')}</h2>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--border-radius-sm)', margin: '1rem 0', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>{t('grievance_id')}:</strong> <span style={{ color: 'var(--corporate-blue)', fontWeight: 700 }}>{grievanceId}</span></p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('category_label')}:</strong> {t(category)}</p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('location_label')}:</strong> {location}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                                📋 {t('grievance_track')}
                            </p>
                        </div>
                        <div className="success-screen__actions">
                            <button className="btn btn-primary" onClick={() => navigate('/track-status')}>
                                {t('track_status_btn')}
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                                <Home size={16} /> {t('go_home')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
