import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, CreditCard, CheckCircle, Printer, Download, Home, Zap, Flame, Droplets, Trash2, Landmark } from 'lucide-react';
import VirtualKeyboard from '../components/VirtualKeyboard';

const serviceIcons = {
    electricity: { icon: Zap, color: '#FF9933', labelKey: 'service_electricity' },
    gas: { icon: Flame, color: '#E53E3E', labelKey: 'service_gas' },
    water: { icon: Droplets, color: '#0B5394', labelKey: 'service_water' },
    waste: { icon: Trash2, color: '#38A169', labelKey: 'service_waste' },
    property: { icon: Landmark, color: '#805AD5', labelKey: 'service_property' },
};

const mockBills = {
    electricity: { name: 'Rajesh Kumar', id: 'ELEC-292847', period: 'Jan 2026 - Feb 2026', amount: '₹2,340', due: '15 Mar 2026', units: '284 kWh', rate: '₹8.24/kWh' },
    gas: { name: 'Rajesh Kumar', id: 'GAS-104827', period: 'Jan 2026 - Feb 2026', amount: '₹890', due: '20 Mar 2026', units: '12.4 SCM', rate: '₹71.78/SCM' },
    water: { name: 'Rajesh Kumar', id: 'WTR-382910', period: 'Jan 2026 - Feb 2026', amount: '₹450', due: '10 Mar 2026', units: '18 KL', rate: '₹25/KL' },
    waste: { name: 'Rajesh Kumar', id: 'WST-019283', period: 'Jan 2026 - Feb 2026', amount: '₹200', due: '28 Feb 2026', units: 'Residential', rate: 'Flat Rate' },
    property: { name: 'Rajesh Kumar', id: 'PROP-583921', period: 'FY 2025-2026', amount: '₹8,500', due: '31 Mar 2026', units: '1200 sq.ft', rate: '₹7.08/sq.ft' },
};

const paymentMethodKeys = ['payment_upi', 'payment_debit', 'payment_netbanking', 'payment_cash'];

export default function BillPayment() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const serviceType = searchParams.get('service') || 'electricity';

    const [wizardStep, setWizardStep] = useState(1);
    const [consumerId, setConsumerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');

    const bill = mockBills[serviceType];
    const serviceInfo = serviceIcons[serviceType] || serviceIcons.electricity;
    const ServiceIcon = serviceInfo.icon;

    const steps = [
        { label: t('select_service') },
        { label: t('bill_details') },
        { label: t('payment') },
        { label: t('receipt') },
    ];

    const handleFetchBill = () => {
        if (!consumerId.trim()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setWizardStep(2);
        }, 1200);
    };

    const handlePay = () => {
        if (!paymentMethod) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setWizardStep(4);
        }, 2000);
    };

    // Virtual keyboard handlers
    const handleKeyPress = (key) => {
        setConsumerId(prev => prev + key);
    };
    const handleBackspace = () => {
        setConsumerId(prev => prev.slice(0, -1));
    };
    const handleClear = () => setConsumerId('');

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                <span className="breadcrumb__separator">›</span>
                <span>{t('bill_payment')} — {t(serviceInfo.labelKey)}</span>
            </div>

            {/* Progress Tracker */}
            <div className="progress-tracker">
                {steps.map((s, i) => (
                    <div key={i} className={`progress-step ${wizardStep === i + 1 ? 'active' : ''} ${wizardStep > i + 1 ? 'completed' : ''}`}>
                        {i > 0 && <div className="progress-step__line"></div>}
                        <div className="progress-step__circle">{wizardStep > i + 1 ? '✓' : i + 1}</div>
                    </div>
                ))}
            </div>

            {/* Service Tabs */}
            <div className="service-tabs" style={{ marginBottom: '1.5rem' }}>
                {Object.entries(serviceIcons).map(([key, info]) => {
                    const Icon = info.icon;
                    return (
                        <button
                            key={key}
                            className={`service-tab ${serviceType === key ? 'active' : ''}`}
                            onClick={() => { navigate(`/bill-payment?service=${key}`); setWizardStep(1); setConsumerId(''); }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Icon size={16} color={serviceType === key ? info.color : undefined} />
                                {t(info.labelKey)}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Step 1: Enter Consumer ID */}
            {wizardStep === 1 && (
                <div className="panel animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="panel__header">
                        <ServiceIcon size={24} color={serviceInfo.color} />
                        <h2 className="panel__title">{t(serviceInfo.labelKey)} — {t('bill_payment')}</h2>
                    </div>
                    <div className="form-group">
                        <label htmlFor="consumer-id">{t('enter_consumer_id')}</label>
                        <input
                            id="consumer-id"
                            type="text"
                            value={consumerId}
                            readOnly
                            placeholder={bill.id}
                            style={{ fontSize: '1.1rem', fontWeight: 500 }}
                            inputMode="none"
                        />
                    </div>
                    {/* On-screen keyboard */}
                    <div className="form-keyboard-area">
                        <VirtualKeyboard
                            mode="text"
                            onKeyPress={handleKeyPress}
                            onBackspace={handleBackspace}
                            onClear={handleClear}
                        />
                    </div>
                    <button className="btn btn-primary btn-block btn-lg" onClick={handleFetchBill} disabled={loading} style={{ marginTop: '0.75rem' }}>
                        {loading ? t('fetching_bill') : <>{t('fetch_bill')} <ArrowRight size={18} /></>}
                    </button>
                </div>
            )}

            {/* Step 2: Bill Details */}
            {wizardStep === 2 && (
                <div className="panel animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div className="panel__header">
                        <ServiceIcon size={24} color={serviceInfo.color} />
                        <h2 className="panel__title">{t('bill_details')}</h2>
                    </div>
                    <table className="bill-table">
                        <tbody>
                            <tr><th>{t('consumer_name')}</th><td>{bill.name}</td></tr>
                            <tr><th>{t('consumer_id')}</th><td>{bill.id}</td></tr>
                            <tr><th>{t('bill_period')}</th><td>{bill.period}</td></tr>
                            <tr><th>{t('consumption')}</th><td>{bill.units}</td></tr>
                            <tr><th>{t('rate')}</th><td>{bill.rate}</td></tr>
                            <tr><th>{t('due_date')}</th><td>{bill.due}</td></tr>
                            <tr className="total-row"><td style={{ fontWeight: 700 }}>{t('bill_amount')}</td><td>{bill.amount}</td></tr>
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => setWizardStep(1)}>
                            <ArrowLeft size={16} /> {t('back')}
                        </button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setWizardStep(3)}>
                            {t('pay_now')} — {bill.amount} <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Payment Method */}
            {wizardStep === 3 && (
                <div className="panel animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="panel__header">
                        <CreditCard size={24} color="var(--corporate-blue)" />
                        <h2 className="panel__title">{t('select_payment_method')}</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {paymentMethodKeys.map((methodKey) => (
                            <div
                                key={methodKey}
                                className={`language-card ${paymentMethod === methodKey ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod(methodKey)}
                                style={{ textAlign: 'left', padding: '1rem 1.25rem' }}
                            >
                                <div className="language-card__native" style={{ fontSize: '1rem' }}>{t(methodKey)}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => setWizardStep(2)}>
                            <ArrowLeft size={16} /> {t('back')}
                        </button>
                        <button className="btn btn-success" style={{ flex: 1 }} onClick={handlePay} disabled={loading || !paymentMethod}>
                            {loading ? t('processing_payment') : <>{t('confirm_payment')} — {bill.amount}</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Success / Receipt */}
            {wizardStep === 4 && (
                <div className="panel animate-scale-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="success-screen">
                        <div className="success-screen__icon">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="success-screen__title">{t('payment_success')}</h2>
                        <p className="success-screen__detail">{t('receipt_generated')}</p>
                        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', margin: '1rem 0', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('transaction_id')}:</strong> TXN-{Date.now().toString().slice(-8)}</p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('service_label')}:</strong> {t(serviceInfo.labelKey)}</p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('consumer_id')}:</strong> {bill.id}</p>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('bill_amount')}:</strong> {bill.amount}</p>
                            <p style={{ fontSize: '0.9rem' }}><strong>{t('payment_mode')}:</strong> {paymentMethod ? t(paymentMethod) : ''}</p>
                        </div>
                        <div className="success-screen__actions">
                            <button className="btn btn-primary">
                                <Printer size={16} /> {t('print_receipt')}
                            </button>
                            <button className="btn btn-secondary">
                                <Download size={16} /> {t('download_receipt')}
                            </button>
                        </div>
                        <button className="btn btn-secondary btn-block" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>
                            <Home size={16} /> {t('go_home')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
