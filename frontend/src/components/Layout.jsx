import { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { useScreenReader } from './ScreenReaderProvider';
import { LogOut, Monitor, Type, Volume2, VolumeX, ChevronDown, LayoutDashboard, CreditCard, MessageSquareWarning, Search, FileText, Settings, BarChart3, AlertCircle, BookOpen, Square, X } from 'lucide-react';

const citizenNavLinks = [
    { labelKey: 'nav_services', path: '/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav_pay_bills', path: '/bill-payment', icon: CreditCard },
    { labelKey: 'nav_grievance', path: '/grievance', icon: MessageSquareWarning },
    { labelKey: 'nav_track_status', path: '/track-status', icon: Search },
    { labelKey: 'nav_documents', path: '/documents', icon: FileText },
];

const adminNavLinks = [
    { labelKey: 'nav_overview', path: '/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav_manage_complaints', path: '/admin/complaints', icon: AlertCircle },
    { labelKey: 'nav_reports_analytics', path: '/admin/reports', icon: BarChart3 },
    { labelKey: 'nav_content_management', path: '/admin/content', icon: Settings },
];

export default function Layout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { fontScale, changeFontScale, currentLang, changeLanguage, isAuthenticated, logout, userRole } = useContext(AppContext);

    const currentNavLinks = userRole === 'admin' ? adminNavLinks : citizenNavLinks;
    const { enabled: srEnabled, speaking, toggle: toggleSR, readPage, stop: stopSR } = useScreenReader();

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
                            <Monitor size={14} style={{ marginRight: '6px' }} /> {t('main_content')}
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
                        <button className={`uidai-top-action ${srEnabled ? 'sr-active-btn' : ''}`} onClick={toggleSR}>
                            {srEnabled ? <VolumeX size={14} style={{ marginRight: '6px' }} /> : <Volume2 size={14} style={{ marginRight: '6px' }} />}
                            {t('screen_reader')} {srEnabled ? '●' : ''}
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
                            <strong>{t('unified_civic_services')}</strong><br />
                            {t('authority_of_india')}
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
                                        {t(link.labelKey)}
                                    </div>
                                );
                            })}
                            {isAuthenticated && (
                                <div className="uidai-nav-item header-logout" onClick={handleLogout}>
                                    <LogOut size={14} style={{ marginRight: '6px' }} /> {t('logout')}
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

            {/* Screen Reader Floating Control Bar */}
            {srEnabled && (
                <div className="sr-control-bar">
                    <div className="sr-control-bar__indicator">
                        <Volume2 size={16} className={speaking ? 'sr-pulse' : ''} />
                        <span>{t('screen_reader')}</span>
                    </div>
                    <div className="sr-control-bar__actions">
                        <button className="sr-control-btn" onClick={readPage} title={currentLang === 'hi' ? 'पूरा पेज पढ़ें' : 'Read Full Page'}>
                            <BookOpen size={16} />
                            <span>{currentLang === 'hi' ? 'पेज पढ़ें' : 'Read Page'}</span>
                        </button>
                        {speaking && (
                            <button className="sr-control-btn sr-control-btn--stop" onClick={stopSR} title={currentLang === 'hi' ? 'रोकें' : 'Stop'}>
                                <Square size={14} />
                                <span>{currentLang === 'hi' ? 'रोकें' : 'Stop'}</span>
                            </button>
                        )}
                        <button className="sr-control-btn sr-control-btn--close" onClick={toggleSR} title={currentLang === 'hi' ? 'बंद करें' : 'Close'}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
