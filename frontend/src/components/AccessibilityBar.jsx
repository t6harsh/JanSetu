import { useContext, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { useScreenReader } from './ScreenReaderProvider';
import { languages } from '../config/languages';
import { Monitor, Type, Volume2, VolumeX, ChevronDown, Eye, EyeOff } from 'lucide-react';

export default function AccessibilityBar() {
    const { t } = useTranslation();
    const { fontScale, changeFontScale, currentLang, changeLanguage, highContrast, toggleHighContrast } = useContext(AppContext);
    const { enabled: srEnabled, toggle: toggleSR } = useScreenReader();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="accessibility-bar">
            <div className="accessibility-bar__container">
                <a href="#main-content" className="accessibility-bar__action">
                    <Monitor size={14} style={{ marginRight: '6px' }} /> {t('main_content')}
                </a>
                <div className="accessibility-bar__divider"></div>
                <div className="accessibility-bar__action">
                    <Type size={14} style={{ marginRight: '6px' }} />
                    <div className="accessibility-bar__font-scaler">
                        <button onClick={() => changeFontScale('large')}>+ A</button>
                        <button onClick={() => changeFontScale('default')}>A</button>
                        <button onClick={() => changeFontScale('small')}>- A</button>
                    </div>
                </div>
                <div className="accessibility-bar__divider"></div>
                <button
                    className={`accessibility-bar__action ${highContrast ? 'accessibility-bar__action--active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleHighContrast(); }}
                    aria-label={t('high_contrast')}
                >
                    {highContrast ? <EyeOff size={14} style={{ marginRight: '6px' }} /> : <Eye size={14} style={{ marginRight: '6px' }} />}
                    {t('high_contrast')} {highContrast ? '●' : ''}
                </button>
                <div className="accessibility-bar__divider"></div>
                <button className={`accessibility-bar__action ${srEnabled ? 'accessibility-bar__action--sr-active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSR(); }}>
                    {srEnabled ? <VolumeX size={14} style={{ marginRight: '6px' }} /> : <Volume2 size={14} style={{ marginRight: '6px' }} />}
                    {t('screen_reader')} {srEnabled ? '●' : ''}
                </button>
                <div className="accessibility-bar__divider"></div>
                <div className="accessibility-bar__lang-container" ref={langRef} style={{ position: 'relative' }}>
                    <button className="accessibility-bar__action accessibility-bar__lang" onClick={(e) => { e.stopPropagation(); setIsLangOpen(!isLangOpen); }}>
                        <span style={{ fontWeight: 800, marginRight: '4px', fontSize: '1.2em' }}>अ</span>
                        {languages.find(l => l.code === currentLang)?.native || 'English'}
                        <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                    </button>
                    {isLangOpen && (
                        <div className="accessibility-bar__lang-menu" style={{ 
                            position: 'absolute', 
                            top: 'calc(100% + 5px)', 
                            right: '0', 
                            background: '#fff', 
                            color: '#333',
                            border: '1px solid #ddd', 
                            borderRadius: '6px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 100, 
                            minWidth: '130px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {languages.map((lang) => (
                                <button 
                                    key={lang.code}
                                    className="lang-option-btn" 
                                    onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code); setIsLangOpen(false); }} 
                                    style={{ 
                                        padding: '0.75rem 1rem', 
                                        textAlign: 'left', 
                                        border: 'none', 
                                        background: currentLang === lang.code ? '#f0f9ff' : 'transparent', 
                                        color: '#333', 
                                        width: '100%', 
                                        cursor: 'pointer', 
                                        borderBottom: '1px solid #eee', 
                                        fontSize: '0.9rem', 
                                        fontWeight: currentLang === lang.code ? 600 : 400 
                                    }}>
                                    {lang.native}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
