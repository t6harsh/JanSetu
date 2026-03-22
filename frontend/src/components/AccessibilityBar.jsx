import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { useScreenReader } from './ScreenReaderProvider';
import { Monitor, Type, Volume2, VolumeX, ChevronDown, Eye, EyeOff } from 'lucide-react';

export default function AccessibilityBar() {
    const { t } = useTranslation();
    const { fontScale, changeFontScale, currentLang, changeLanguage, highContrast, toggleHighContrast } = useContext(AppContext);
    const { enabled: srEnabled, toggle: toggleSR } = useScreenReader();

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
                <button className="accessibility-bar__action accessibility-bar__lang" onClick={(e) => { e.stopPropagation(); changeLanguage(currentLang === 'en' ? 'hi' : 'en'); }}>
                    <span style={{ fontWeight: 800, marginRight: '4px', fontSize: '1.2em' }}>अ</span>
                    {currentLang === 'en' ? 'English' : 'हिंदी'}
                    <ChevronDown size={14} style={{ marginLeft: '4px' }} />
                </button>
            </div>
        </div>
    );
}
