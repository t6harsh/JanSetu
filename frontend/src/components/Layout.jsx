import { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { LogOut, Monitor, Type, Volume2, ChevronDown, LayoutDashboard, CreditCard, MessageSquareWarning, Search, FileText, Settings, BarChart3, AlertCircle } from 'lucide-react';

const citizenNavLinks = [
    { label: 'Services', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Pay Bills', path: '/bill-payment', icon: CreditCard },
    { label: 'Grievance', path: '/grievance', icon: MessageSquareWarning },
    { label: 'Track Status', path: '/track-status', icon: Search },
    { label: 'Documents', path: '/documents', icon: FileText },
];

const adminNavLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Manage Complaints', path: '/admin/complaints', icon: AlertCircle },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Content Management', path: '/admin/content', icon: Settings },
];

export default function Layout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { fontScale, changeFontScale, currentLang, changeLanguage, isAuthenticated, logout, userRole } = useContext(AppContext);

    const currentNavLinks = userRole === 'admin' ? adminNavLinks : citizenNavLinks;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* UIDAI Style Header */}
            <header className="uidai-header">
                {/* Top Accessibility Bar */}
                <div className="uidai-top-bar">
                    <div className="uidai-top-bar__container">
                        <a href="#main-content" className="uidai-top-action">
                            <Monitor size={14} style={{ marginRight: '6px' }} /> Main Content
                        </a>
                        <div className="uidai-top-divider"></div>
                        <div className="uidai-top-action">
                            <Type size={14} style={{ marginRight: '6px' }} />
                            <div className="uidai-font-scaler">
                                <button onClick={() => changeFontScale('large')}>+ A</button>
                                <button onClick={() => changeFontScale('default')}>A</button>
                                <button onClick={() => changeFontScale('small')}>- A</button>
                            </div>
                        </div>
                        <div className="uidai-top-divider"></div>
                        <button className="uidai-top-action">
                            <Volume2 size={14} style={{ marginRight: '6px' }} /> Screen Reader
                        </button>
                        <div className="uidai-top-divider"></div>
                        <button className="uidai-top-action lang-dropdown" onClick={() => changeLanguage(currentLang === 'en' ? 'hi' : 'en')}>
                            <span style={{ fontWeight: 800, marginRight: '4px', fontSize: '1.2em' }}>अ</span>
                            {currentLang === 'en' ? 'English' : 'हिंदी'}
                            <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                        </button>
                    </div>
                </div>

                {/* Logo Bar */}
                <div className="uidai-logo-bar">
                    <div className="uidai-logo-bar__container">
                        <div className="uidai-logo" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
                            <div className="uidai-logo__icon">
                                <svg viewBox="0 0 100 80" width="70" height="50">
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

                                    <text x="50" y="77" fontSize="12" fontWeight="bold" fill="#0284c7" textAnchor="middle" fontFamily="sans-serif">JANSETU</text>
                                </svg>
                            </div>
                            <div className="uidai-logo__text">
                                <div className="uidai-logo__hi">सुगम सेवा</div>
                                <div className="uidai-logo__en">सुदृढ़ समाज</div>
                            </div>
                        </div>
                        <div className="uidai-authority-text">
                            <strong>Unified Civic Services</strong><br />
                            Authority of India
                        </div>
                    </div>
                </div>

                {/* Navigation Bar — Functional Links */}
                <div className="uidai-nav-bar">
                    <div className="uidai-nav-bar__container">
                        <nav className="uidai-nav-menus">
                            {currentNavLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.path;
                                return (
                                    <div
                                        key={link.path}
                                        className={`uidai-nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => navigate(link.path)}
                                    >
                                        <Icon size={15} style={{ marginRight: '6px' }} />
                                        {link.label}
                                    </div>
                                );
                            })}
                            {isAuthenticated && (
                                <div className="uidai-nav-item header-logout" onClick={handleLogout}>
                                    <LogOut size={14} style={{ marginRight: '6px' }} /> Logout
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main id="main-content" className="main-content">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="gov-footer">
                <span>{t('footer_text')}</span>
                <div className="gov-footer__links">
                    <a href="#">{t('help')}</a>
                    <a href="#">{t('emergency')}</a>
                </div>
            </footer>
        </>
    );
}
