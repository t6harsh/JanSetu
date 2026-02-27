import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../App';
import { ShieldCheck, ArrowRight, RotateCcw, Fingerprint, KeyRound, Lock } from 'lucide-react';
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
            login('Rajesh Kumar');
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
                        </div>
                        <h2 className="auth-brand-panel__title">
                            <span style={{ color: '#6CB4EE' }}>Jan</span><span style={{ color: '#00B4D8' }}>Setu</span> <span style={{ color: '#fff' }}>SUVIDHA</span>
                        </h2>
                        <p className="auth-brand-panel__tagline">Unified Civic Services Portal</p>
                        <p className="auth-brand-panel__hindi">मेरा सुविधा • मेरी पहचान</p>

                        <div className="auth-brand-panel__features">
                            <div className="auth-feature">
                                <Fingerprint size={18} />
                                <span>Aadhaar Verified</span>
                            </div>
                            <div className="auth-feature">
                                <Lock size={18} />
                                <span>256-bit Encrypted</span>
                            </div>
                            <div className="auth-feature">
                                <KeyRound size={18} />
                                <span>OTP Based Login</span>
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
                            <h1>{t('login_title')}</h1>
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
                                            Sending OTP...
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
                                            Verifying...
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
                            <Lock size={12} /> Your data is protected under the Aadhaar Act, 2016
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
