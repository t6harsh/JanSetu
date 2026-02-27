import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { Zap, Flame, Droplets, Trash2, Landmark, MessageSquareWarning, FileText, Search, ArrowRight } from 'lucide-react';

const services = [
    {
        key: 'electricity', icon: Zap, path: '/bill-payment', param: 'electricity',
        stat: '15,234+', statLabel: 'Bills Processed',
        gradient: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
        iconColor: '#FF9933', iconBg: 'rgba(255,153,51,0.15)',
        decoColor: '#FF9933',
        gridArea: 'elec',
    },
    {
        key: 'gas', icon: Flame, path: '/bill-payment', param: 'gas',
        stat: '8,412', statLabel: 'Connections Active',
        gradient: 'linear-gradient(135deg, #FFE6CC 0%, #FFDAB3 100%)',
        iconColor: '#E53E3E', iconBg: 'rgba(229,62,62,0.12)',
        decoColor: '#E53E3E',
        gridArea: 'gas',
    },
    {
        key: 'water', icon: Droplets, path: '/bill-payment', param: 'water',
        stat: '6k+', statLabel: 'Meters Monitored',
        gradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
        iconColor: '#0B5394', iconBg: 'rgba(11,83,148,0.12)',
        decoColor: '#0B5394',
        gridArea: 'water',
    },
    {
        key: 'waste', icon: Trash2, path: '/bill-payment', param: 'waste',
        stat: '1.51 Cr', statLabel: 'Waste Collected (kg)',
        gradient: 'linear-gradient(135deg, #D5F5E3 0%, #A7F3D0 100%)',
        iconColor: '#38A169', iconBg: 'rgba(56,161,105,0.12)',
        decoColor: '#38A169',
        gridArea: 'waste',
    },
    {
        key: 'property', icon: Landmark, path: '/bill-payment', param: 'property',
        stat: '₹48.2L', statLabel: 'Tax Revenue',
        gradient: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
        iconColor: '#805AD5', iconBg: 'rgba(128,90,213,0.12)',
        decoColor: '#805AD5',
        gridArea: 'prop',
    },
    {
        key: 'grievance', icon: MessageSquareWarning, path: '/grievance',
        stat: '892', statLabel: 'Resolved This Month',
        gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        iconColor: '#D69E2E', iconBg: 'rgba(214,158,46,0.12)',
        decoColor: '#D69E2E',
        gridArea: 'griev',
    },
    {
        key: 'documents', icon: FileText, path: '/documents',
        stat: '52+', statLabel: 'Certificate Types',
        gradient: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
        iconColor: '#EC4899', iconBg: 'rgba(236,72,153,0.12)',
        decoColor: '#EC4899',
        gridArea: 'docs',
    },
    {
        key: 'status', icon: Search, path: '/track-status',
        stat: '184.6M', statLabel: 'Requests Tracked',
        gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        iconColor: '#059669', iconBg: 'rgba(5,150,105,0.12)',
        decoColor: '#059669',
        gridArea: 'track',
    },
];

export default function CitizenDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { citizenName } = useContext(AppContext);

    const handleNavigate = (service) => {
        if (service.param) {
            navigate(`${service.path}?service=${service.param}`);
        } else {
            navigate(service.path);
        }
    };

    return (
        <div className="animate-fade-in dashboard-page">
            {/* Hero Welcome Banner */}
            <div className="welcome-hero">
                <div className="welcome-hero__content">
                    <div className="welcome-hero__greeting">
                        Namaste, <span className="welcome-hero__name">{citizenName}</span> 🙏
                    </div>
                    <div className="welcome-hero__subtitle">
                        Access all civic services from one place — pay bills, file grievances, track requests & more
                    </div>
                </div>
                <div className="welcome-hero__deco">
                    <svg viewBox="0 0 200 200" width="120" height="120" style={{ opacity: 0.1 }}>
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#fff" strokeWidth="4" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="#fff" strokeWidth="3" />
                        <circle cx="100" cy="100" r="30" fill="none" stroke="#fff" strokeWidth="2" />
                        <path d="M100 10 L100 190 M10 100 L190 100" stroke="#fff" strokeWidth="2" opacity="0.5" />
                    </svg>
                </div>
            </div>

            {/* Section Title */}
            <div className="section-title-row">
                <h2>
                    <span className="section-title-accent">Services</span>
                </h2>
                <span className="section-title-count">{services.length} services available</span>
            </div>

            {/* Bento Grid — Mixed Sizes */}
            <div className="bento-grid">
                {services.map((service) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={service.key}
                            className="bento-card"
                            style={{ background: service.gradient, gridArea: service.gridArea }}
                            onClick={() => handleNavigate(service)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleNavigate(service)}
                            aria-label={t(`service_${service.key}`)}
                        >
                            {/* Service Logo / Title */}
                            <div className="bento-card__header">
                                <div className="bento-card__logo" style={{ background: service.iconBg }}>
                                    <Icon size={22} color={service.iconColor} strokeWidth={2.5} />
                                </div>
                                <span className="bento-card__name" style={{ color: service.iconColor }}>
                                    {t(`service_${service.key}`)}
                                </span>
                            </div>

                            {/* Stat */}
                            <div className="bento-card__stat" style={{ color: service.decoColor }}>
                                {service.stat}
                            </div>
                            <div className="bento-card__stat-label">
                                {service.statLabel}
                            </div>

                            {/* CTA Arrow */}
                            <div className="bento-card__cta">
                                <ArrowRight size={18} color={service.iconColor} />
                            </div>

                            {/* Decorative Icon — zooms on hover */}
                            <div className="bento-card__deco">
                                <Icon size={90} color={service.decoColor} strokeWidth={1} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
