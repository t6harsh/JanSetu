import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { Check, ArrowRight, Globe } from 'lucide-react';

const languages = [
    { code: 'en', native: 'English', english: 'English', flag: '🇬🇧' },
    { code: 'hi', native: 'हिंदी', english: 'Hindi', flag: '🇮🇳' },
    { code: 'mr', native: 'मराठी', english: 'Marathi', flag: '🇮🇳' },
    { code: 'ta', native: 'தமிழ்', english: 'Tamil', flag: '🇮🇳' },
    { code: 'te', native: 'తెలుగు', english: 'Telugu', flag: '🇮🇳' },
    { code: 'bn', native: 'বাংলা', english: 'Bengali', flag: '🇮🇳' },
    { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', flag: '🇮🇳' },
    { code: 'ml', native: 'മലയാളം', english: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', flag: '🇮🇳' },
    { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', flag: '🇮🇳' },
    { code: 'as', native: 'অসমীয়া', english: 'Assamese', flag: '🇮🇳' },
    { code: 'ur', native: 'اردو', english: 'Urdu', flag: '🇮🇳' },
];

export default function LanguageSelect() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { changeLanguage } = useContext(AppContext);
    const [selected, setSelected] = useState('en');

    const handleContinue = () => {
        changeLanguage(selected);
        navigate('/auth');
    };

    return (
        <div className="lang-page">
            {/* Tricolor Bar */}
            <div className="tricolor-bar" role="presentation">
                <div className="tricolor-bar__saffron"></div>
                <div className="tricolor-bar__white"></div>
                <div className="tricolor-bar__green"></div>
            </div>

            {/* Header Section (Logo and Name) */}
            <div className="lang-page__header">
                <div className="lang-page__logo-row">
                    <svg viewBox="0 0 100 80" width="75" height="60">
                        <path d="M50 15 A 35 35 0 0 1 85 50 L 15 50 A 35 35 0 0 1 50 15 Z" fill="#FDE047" />
                        <line x1="50" y1="15" x2="50" y2="5" stroke="#FDE047" strokeWidth="3" />
                        <line x1="25" y1="25" x2="18" y2="18" stroke="#FDE047" strokeWidth="3" />
                        <line x1="75" y1="25" x2="82" y2="18" stroke="#FDE047" strokeWidth="3" />
                        <line x1="15" y1="40" x2="5" y2="40" stroke="#FDE047" strokeWidth="3" />
                        <line x1="85" y1="40" x2="95" y2="40" stroke="#FDE047" strokeWidth="3" />
                        <path d="M25 50 Q 50 5 75 50" fill="none" stroke="#DC2626" strokeWidth="5.5" strokeLinecap="round" />
                        <path d="M35 50 Q 50 20 65 50" fill="none" stroke="#DC2626" strokeWidth="5.5" strokeLinecap="round" />
                        <path d="M45 50 Q 50 35 55 50" fill="none" stroke="#DC2626" strokeWidth="5.5" strokeLinecap="round" />
                    </svg>
                    <div className="lang-page__brand-container">
                        <div className="lang-page__brand">
                            <span style={{ color: '#0B5394' }}>Jan</span><span style={{ color: '#00B4D8' }}>Setu</span> SUVIDHA
                        </div>
                        <div className="lang-page__tagline">
                            मेरा सुविधा • मेरी पहचान
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Section (Title + Grid) */}
            <div className="lang-page__center">
                <div className="lang-page__title-row">
                    <Globe size={24} color="#B45309" />
                    <h1 className="lang-page__title">{t('select_language')} / अपनी भाषा चुनें</h1>
                </div>
                <p className="lang-page__subtitle">Choose your preferred language to continue</p>

                {/* Language Grid — fits in single page */}
                <div className="lang-grid">
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            className={`lang-card ${selected === lang.code ? 'lang-card--selected' : ''}`}
                            onClick={() => setSelected(lang.code)}
                            role="radio"
                            aria-checked={selected === lang.code}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setSelected(lang.code)}
                        >
                            <div className="lang-card__check">
                                {selected === lang.code && <Check size={14} color="#fff" strokeWidth={3} />}
                            </div>
                            <div className="lang-card__text">
                                <div className="lang-card__native">{lang.native}</div>
                                <div className="lang-card__english">{lang.english}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Continue Button — always visible at bottom */}
            <div className="lang-page__footer">
                <button className="lang-continue-btn" onClick={handleContinue}>
                    <span>Continue</span>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
