import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { Check, ArrowRight, Globe } from 'lucide-react';

import { languages } from '../config/languages';

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
                    <div className="lang-page__brand-container">
                        <div className="lang-page__brand">
                            <span style={{ color: '#0B5394' }}>Jan</span><span style={{ color: '#00B4D8' }}>Setu</span> SUVIDHA
                        </div>
                        <div className="lang-page__tagline">
                            सुगम सेवा • सुदृढ़ समाज
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Section (Title + Grid) */}
            <div className="lang-page__center">
                <div className="lang-page__title-row">
                    <Globe size={24} color="#B45309" />
                    <h1 className="lang-page__title">{t('select_language')}</h1>
                </div>
                <p className="lang-page__subtitle">{t('choose_language_subtitle')}</p>

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
                    <span>{t('continue')}</span>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
