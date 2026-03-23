import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { Zap, HandHelping, Users, Droplets, Wifi, ArrowRight, Flame, MessageSquareWarning, CreditCard, Recycle, Building } from 'lucide-react';

export default function IdleScreen() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { changeFontScale } = useContext(AppContext);

    // Animated counters
    const [bills, setBills] = useState(0);
    const [complaints, setComplaints] = useState(0);
    const [citizens, setCitizens] = useState(0);

    useEffect(() => {
        const targetBills = 15234;
        const targetComplaints = 892;
        const targetCitizens = 48721;
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const ease = 1 - Math.pow(1 - progress, 3);
            setBills(Math.floor(targetBills * ease));
            setComplaints(Math.floor(targetComplaints * ease));
            setCitizens(Math.floor(targetCitizens * ease));
            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const handleTap = () => {
        navigate('/language');
    };

    const handleQuickService = (path) => {
        navigate(path);
    };

    return (
        <div className="idle-screen animate-fade-in" onClick={handleTap} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleTap()}>
            {/* Tricolor Bar */}
            <div className="tricolor-bar" role="presentation" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <div className="tricolor-bar__saffron"></div>
                <div className="tricolor-bar__white"></div>
                <div className="tricolor-bar__green"></div>
            </div>

            {/* Decorative Background Elements */}
            <div className="idle-bg-deco">
                <div className="idle-bg-deco__circle idle-bg-deco__circle--1"></div>
                <div className="idle-bg-deco__circle idle-bg-deco__circle--2"></div>
                <div className="idle-bg-deco__circle idle-bg-deco__circle--3"></div>
            </div>

            {/* Main Content */}
            <div className="idle-hero">
                {/* Logo */}
                <div className="idle-hero__logo">
                    <svg viewBox="0 0 100 80" width="90" height="65">
                        <defs>
                            <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0284c7" />
                                <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                        </defs>
                        {/* Connections */}
                        <path d="M 25 25 Q 50 10 75 25" fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 4" />
                        <path d="M 25 55 Q 50 70 75 55" fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 4" />
                        <line x1="25" y1="25" x2="25" y2="55" stroke="url(#nodeGrad)" strokeWidth="3" opacity="0.5" />
                        <line x1="75" y1="25" x2="75" y2="55" stroke="url(#nodeGrad)" strokeWidth="3" opacity="0.5" />
                        <line x1="50" y1="15" x2="50" y2="65" stroke="#10b981" strokeWidth="3" opacity="0.5" />

                        {/* Nodes */}
                        <circle cx="25" cy="25" r="8" fill="url(#nodeGrad)" />
                        <circle cx="75" cy="25" r="8" fill="url(#nodeGrad)" />
                        <circle cx="25" cy="55" r="8" fill="url(#nodeGrad)" />
                        <circle cx="75" cy="55" r="8" fill="url(#nodeGrad)" />
                        <circle cx="50" cy="40" r="10" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    </svg>
                </div>

                <h1 className="idle-hero__title">
                    <span className="idle-hero__title-jan">Jan</span><span className="idle-hero__title-setu">Setu</span>
                    <span className="idle-hero__title-suvidha">SUVIDHA</span>
                </h1>
                <p className="idle-hero__tagline">
                    सुगम सेवा • सुदृढ़ समाज
                </p>
                <p className="idle-hero__subtitle">
                    {t('kiosk_subtitle')} | C-DAC | Smart City Mission
                </p>
            </div>

            {/* Impact Metrics Row */}
            <div className="idle-metrics">
                <div className="idle-metric-card">
                    <div className="idle-metric-card__icon" style={{ background: 'rgba(255,153,51,0.12)' }}>
                        <Zap size={22} color="#FF9933" />
                    </div>
                    <div className="idle-metric-card__value">{bills.toLocaleString()}+</div>
                    <div className="idle-metric-card__label">{t('bills_processed')}</div>
                </div>

                <div className="idle-metric-card">
                    <div className="idle-metric-card__icon" style={{ background: 'rgba(11,83,148,0.12)' }}>
                        <HandHelping size={22} color="#0B5394" />
                    </div>
                    <div className="idle-metric-card__value">{complaints.toLocaleString()}</div>
                    <div className="idle-metric-card__label">{t('complaints_resolved')}</div>
                </div>

                <div className="idle-metric-card">
                    <div className="idle-metric-card__icon" style={{ background: 'rgba(56,161,105,0.12)' }}>
                        <Users size={22} color="#38A169" />
                    </div>
                    <div className="idle-metric-card__value">{citizens.toLocaleString()}+</div>
                    <div className="idle-metric-card__label">{t('citizens_served')}</div>
                </div>
            </div>

            {/* Quick Services Section (Sidebars) */}
            <div className="quick-services-section" style={{
                position: 'absolute',
                top: '50%',
                left: '2rem',
                right: '2rem',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 50
            }}>
                <div className="quick-services-grid" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    margin: '0 auto'
                }}>
                    {/* Left Side: Electricity, Gas */}
                    <div className="quick-services-left" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        pointerEvents: 'auto'
                    }}>
                        {/* Electricity */}
                        <button
                            className="quick-service-card"
                            onClick={(e) => { e.stopPropagation(); handleQuickService('/quick-bill-payment?service=electricity'); }}
                            style={{
                                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.8rem 0.6rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                width: '190px',
                                height: '165px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{
                                background: 'rgba(217,119,6,0.12)',
                                borderRadius: '50%',
                                padding: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(217,119,6,0.2)'
                            }}>
                                <Zap size={36} color="#D97706" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                                    {t('service_electricity')}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                    {t('pay_without_login')}
                                </div>
                            </div>
                        </button>

                        {/* Gas */}
                        <button
                            className="quick-service-card"
                            onClick={(e) => { e.stopPropagation(); handleQuickService('/quick-bill-payment?service=gas'); }}
                            style={{
                                background: 'linear-gradient(135deg, #FFE6CC 0%, #FFDAB3 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.8rem 0.6rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                width: '190px',
                                height: '165px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{
                                background: 'rgba(229,62,62,0.12)',
                                borderRadius: '50%',
                                padding: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(229,62,62,0.2)'
                            }}>
                                <Flame size={36} color="#E53E3E" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                                    {t('quick_gas_bill')}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                    {t('pay_without_login')}
                                </div>
                            </div>
                        </button>

                    </div>

                    {/* Right Side: Water, Property Tax */}
                    <div className="quick-services-right" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        pointerEvents: 'auto'
                    }}>
                        {/* Water */}
                        <button
                            className="quick-service-card"
                            onClick={(e) => { e.stopPropagation(); handleQuickService('/quick-bill-payment?service=water'); }}
                            style={{
                                background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.8rem 0.6rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                width: '190px',
                                height: '165px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{
                                background: 'rgba(11,83,148,0.12)',
                                borderRadius: '50%',
                                padding: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(11,83,148,0.2)'
                            }}>
                                <Droplets size={36} color="#0B5394" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                                    {t('service_water')}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                    {t('pay_without_login')}
                                </div>
                            </div>
                        </button>

                        {/* Property Tax */}
                        <button
                            className="quick-service-card"
                            onClick={(e) => { e.stopPropagation(); handleQuickService('/quick-bill-payment?service=property'); }}
                            style={{
                                background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.8rem 0.6rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                width: '190px',
                                height: '165px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{
                                background: 'rgba(124,58,237,0.12)',
                                borderRadius: '50%',
                                padding: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid rgba(124,58,237,0.2)'
                            }}>
                                <Building size={36} color="#7C3AED" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                                    {t('service_property')}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                    {t('pay_without_login')}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Strip */}
            <div className="idle-status-strip">
                <div className="idle-status-strip__item">
                    <span className="status-dot status-dot--green"></span>
                    <span>{t('grid_status')}: {t('grid_stable')}</span>
                </div>
                <div className="idle-status-strip__divider"></div>
                <div className="idle-status-strip__item">
                    <Droplets size={14} color="#0B5394" />
                    <span>{t('water_supply')}: {t('water_normal')}</span>
                </div>
                <div className="idle-status-strip__divider"></div>
                <div className="idle-status-strip__item">
                    <Wifi size={14} color="#38A169" />
                    <span>Kiosk Online</span>
                </div>
            </div>

            {/* CTA Button */}
            <button className="idle-cta-btn" onClick={handleTap}>
                <span>{t('tap_to_start')}</span>
                <ArrowRight size={20} />
            </button>

            {/* Footer */}
            <footer className="idle-footer">
                <span>{t('footer_text')}</span>
                <div className="idle-footer__links">
                    <a href="#">{t('help')}</a>
                    <a href="#">{t('emergency')}</a>
                </div>
            </footer>
        </div>
    );
}
