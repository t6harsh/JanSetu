import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { ShieldCheck, ArrowRight, RotateCcw, Fingerprint, KeyRound, Lock, User, Shield } from 'lucide-react';
import VirtualKeyboard from '../components/VirtualKeyboard';

export default function AuthScreen() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useContext(AppContext);

    const [step, setStep] = useState(1);
    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginRole, setLoginRole] = useState('citizen'); // 'citizen' | 'admin'
    const otpRefs = useRef([]);

    const formatAadhaar = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 12);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const handleSendOTP = () => {
        const digits = aadhaar.replace(/\s/g, '');
        if (digits.length < 10) {
            setError('Please enter a valid Aadhaar or Mobile number');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleOTPChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpStr = otp.join('');
        if (otpStr.length < 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            login('Rajesh Kumar', loginRole);
            navigate('/dashboard');
        }, 1500);
    };

    // Virtual keyboard handlers for Aadhaar
    const handleAadhaarKeyPress = (key) => {
        const digits = aadhaar.replace(/\s/g, '');
        if (digits.length < 12 && /^\d$/.test(key)) {
            setAadhaar(formatAadhaar(digits + key));
        }
    };
    const handleAadhaarBackspace = () => {
        const digits = aadhaar.replace(/\s/g, '');
        setAadhaar(formatAadhaar(digits.slice(0, -1)));
    };
    const handleAadhaarClear = () => setAadhaar('');

    // Virtual keyboard handlers for OTP
    const handleOtpKeyPress = (key) => {
        if (!/^\d$/.test(key)) return;
        const firstEmpty = otp.findIndex(d => d === '');
        if (firstEmpty !== -1) {
            const newOtp = [...otp];
            newOtp[firstEmpty] = key;
            setOtp(newOtp);
            if (firstEmpty < 5) otpRefs.current[firstEmpty + 1]?.focus();
        }
    };
    const handleOtpBackspace = () => {
        const lastFilled = otp.map((d, i) => d ? i : -1).filter(i => i !== -1).pop();
        if (lastFilled !== undefined) {
            const newOtp = [...otp];
            newOtp[lastFilled] = '';
            setOtp(newOtp);
            otpRefs.current[lastFilled]?.focus();
        }
    };
    const handleOtpClear = () => {
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
    };

    // Handle voice assistant fill events
    useEffect(() => {
        const handleVaFill = (e) => {
            const { digits } = e.detail;
            if (digits && step === 1) {
                // Handle Aadhaar input
                const currentDigits = aadhaar.replace(/\s/g, '');
                if (currentDigits.length < 12) {
                    setAadhaar(formatAadhaar(currentDigits + digits));
                }
            } else if (digits && step === 2) {
                // Handle OTP input
                const firstEmpty = otp.findIndex(d => d === '');
                if (firstEmpty !== -1 && digits.length > 0) {
                    // Fill OTP digits one by one
                    let newOtp = [...otp];
                    let otpIndex = firstEmpty;
                    for (let i = 0; i < digits.length && otpIndex < 6; i++) {
                        newOtp[otpIndex] = digits[i];
                        otpIndex++;
                    }
                    setOtp(newOtp);
                    // Focus next empty input
                    if (otpIndex < 6) {
                        otpRefs.current[otpIndex]?.focus();
                    }
                }
            }
        };

        const aadhaarInput = document.getElementById('aadhaar-input');
        if (aadhaarInput) {
            aadhaarInput.addEventListener('va-fill', handleVaFill);
            return () => {
                aadhaarInput.removeEventListener('va-fill', handleVaFill);
            };
        }
    }, [aadhaar, step, otp]);

    return (
        <div className="auth-page">
            {/* Tricolor Bar */}
            <div className="tricolor-bar" role="presentation">
                <div className="tricolor-bar__saffron"></div>
                <div className="tricolor-bar__white"></div>
                <div className="tricolor-bar__green"></div>
            </div>

            <div className="auth-page__layout">
                {/* Left Panel — Branding */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-panel__content">
                        <div className="auth-brand-panel__logo">
                            <svg viewBox="0 0 100 80" width="80" height="58">
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
                        <h2 className="auth-brand-panel__title">
                            <span style={{ color: '#6CB4EE' }}>Jan</span><span style={{ color: '#00B4D8' }}>Setu</span> <span style={{ color: '#fff' }}>SUVIDHA</span>
                        </h2>
                        <p className="auth-brand-panel__tagline">{t('unified_portal')}</p>
                        <p className="auth-brand-panel__hindi">सुगम सेवा • सुदृढ़ समाज</p>

                        <div className="auth-brand-panel__features">
                            <div className="auth-feature">
                                <Fingerprint size={18} />
                                <span>{t('aadhaar_verified')}</span>
                            </div>
                            <div className="auth-feature">
                                <Lock size={18} />
                                <span>{t('encrypted_256')}</span>
                            </div>
                            <div className="auth-feature">
                                <KeyRound size={18} />
                                <span>{t('otp_based_login')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative circles */}
                    <div className="auth-brand-deco auth-brand-deco--1"></div>
                    <div className="auth-brand-deco auth-brand-deco--2"></div>
                </div>

                {/* Right Panel — Auth Form */}
                <div className="auth-form-panel">
                    <div className="auth-form-card animate-fade-in">
                        <div className="auth-form-card__header">
                            <ShieldCheck size={26} color="#0B5394" />
                            <h1>{loginRole === 'admin' ? t('admin_login_title') : t('login_title')}</h1>
                        </div>

                        {/* Role Toggle */}
                        <div className="auth-role-toggle">
                            <button
                                className={`auth-role-toggle__btn ${loginRole === 'citizen' ? 'active' : ''}`}
                                onClick={() => step === 1 && setLoginRole('citizen')}
                                type="button"
                                disabled={step > 1}
                                style={{ opacity: step > 1 ? 0.6 : 1, cursor: step > 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <User size={16} /> {t('citizen_login')}
                            </button>
                            <button
                                className={`auth-role-toggle__btn ${loginRole === 'admin' ? 'active' : ''}`}
                                onClick={() => step === 1 && setLoginRole('admin')}
                                type="button"
                                disabled={step > 1}
                                style={{ opacity: step > 1 ? 0.6 : 1, cursor: step > 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <Shield size={16} /> {t('admin_login')}
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="auth-progress">
                            <div className={`auth-progress__step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                                <div className="auth-progress__circle">{step > 1 ? '✓' : '1'}</div>
                                <span className="auth-progress__label">Aadhaar</span>
                            </div>
                            <div className={`auth-progress__line ${step > 1 ? 'active' : ''}`}></div>
                            <div className={`auth-progress__step ${step >= 2 ? 'active' : ''}`}>
                                <div className="auth-progress__circle">2</div>
                                <span className="auth-progress__label">OTP</span>
                            </div>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="animate-fade-in">
                                <div className="auth-form-group">
                                    <label htmlFor="aadhaar-input">{t('enter_aadhaar')}</label>
                                    <div className="auth-input-wrapper">
                                        <Fingerprint size={18} className="auth-input-icon" />
                                        <input
                                            id="aadhaar-input"
                                            type="text"
                                            value={aadhaar}
                                            readOnly
                                            placeholder="XXXX XXXX XXXX"
                                            className="auth-input"
                                            inputMode="none"
                                        />
                                    </div>
                                </div>
                                {/* On-screen numeric keypad */}
                                <div className="auth-keyboard-area">
                                    <VirtualKeyboard
                                        mode="numeric"
                                        onKeyPress={handleAadhaarKeyPress}
                                        onBackspace={handleAadhaarBackspace}
                                        onClear={handleAadhaarClear}
                                    />
                                </div>
                                <button
                                    className="auth-btn auth-btn--primary"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    style={{ marginTop: '0.75rem' }}
                                >
                                    {loading ? (
                                        <span className="auth-btn__loading">
                                            <span className="auth-spinner"></span>
                                            {t('sending_otp')}
                                        </span>
                                    ) : (
                                        <>{t('send_otp')} <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                <div className="auth-otp-sent">
                                    ✓ {t('otp_sent')}
                                </div>
                                <div className="auth-form-group">
                                    <label style={{ textAlign: 'center' }}>{t('enter_otp')}</label>
                                    <div className="auth-otp-inputs">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={(el) => otpRefs.current[i] = el}
                                                className="auth-otp-box"
                                                type="text"
                                                inputMode="none"
                                                maxLength={1}
                                                value={digit}
                                                readOnly
                                                aria-label={`OTP Digit ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {/* On-screen numeric keypad for OTP */}
                                <div className="auth-keyboard-area">
                                    <VirtualKeyboard
                                        mode="numeric"
                                        onKeyPress={handleOtpKeyPress}
                                        onBackspace={handleOtpBackspace}
                                        onClear={handleOtpClear}
                                    />
                                </div>
                                <button
                                    className="auth-btn auth-btn--success"
                                    onClick={handleVerify}
                                    disabled={loading}
                                    style={{ marginTop: '0.75rem' }}
                                >
                                    {loading ? (
                                        <span className="auth-btn__loading">
                                            <span className="auth-spinner"></span>
                                            {t('verifying')}
                                        </span>
                                    ) : (
                                        <>{t('verify_otp')} <ShieldCheck size={18} /></>
                                    )}
                                </button>
                                <button
                                    className="auth-btn auth-btn--ghost"
                                    onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}
                                >
                                    <RotateCcw size={16} /> {t('resend_otp')}
                                </button>
                            </div>
                        )}

                        <div className="auth-form-card__footer">
                            <Lock size={12} /> {t('data_protected')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
