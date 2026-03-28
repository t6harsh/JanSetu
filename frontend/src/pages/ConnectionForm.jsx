import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Home, User, FileText, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const connectionFormFields = {
    electricity: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'address', label: 'Service Address', type: 'textarea', required: true },
        { key: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: false },
        { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Industrial'], required: true },
        { key: 'connectionType', label: 'Connection Type', type: 'select', options: ['New Connection', 'Connection Change', 'Load Enhancement'], required: true },
        { key: 'requiredLoad', label: 'Required Load (kW)', type: 'number', required: true },
        { key: 'purpose', label: 'Purpose of Connection', type: 'textarea', required: true }
    ],
    water: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'address', label: 'Service Address', type: 'textarea', required: true },
        { key: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: false },
        { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial'], required: true },
        { key: 'connectionSize', label: 'Connection Size', type: 'select', options: ['0.5 inch', '0.75 inch', '1 inch', '1.5 inch'], required: true },
        { key: 'familySize', label: 'Family Size', type: 'number', required: true },
        { key: 'purpose', label: 'Purpose of Connection', type: 'textarea', required: true }
    ],
    gas: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'address', label: 'Service Address', type: 'textarea', required: true },
        { key: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: false },
        { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial'], required: true },
        { key: 'connectionType', label: 'Gas Type', type: 'select', options: ['PNG (Piped Natural Gas)', 'LPG (Liquefied Petroleum Gas)'], required: true },
        { key: 'kitchenSize', label: 'Kitchen Size (sq ft)', type: 'number', required: true },
        { key: 'purpose', label: 'Purpose of Connection', type: 'textarea', required: true }
    ],
    waste: [
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'address', label: 'Service Address', type: 'textarea', required: true },
        { key: 'mobile', label: 'Mobile Number', type: 'tel', required: true },
        { key: 'email', label: 'Email Address', type: 'email', required: false },
        { key: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Industrial'], required: true },
        { key: 'wasteType', label: 'Waste Type', type: 'select', options: ['Domestic Waste', 'Commercial Waste', 'Mixed Waste'], required: true },
        { key: 'frequency', label: 'Collection Frequency', type: 'select', options: ['Daily', 'Alternate Days', 'Weekly'], required: true },
        { key: 'estimatedWaste', label: 'Estimated Waste (kg/day)', type: 'number', required: true }
    ]
};

export default function ConnectionForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [connectionType, setConnectionType] = useState('');
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Get connection type from URL query params
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        if (type && connectionFormFields[type]) {
            setConnectionType(type);
            // Initialize form data
            const initialData = {};
            connectionFormFields[type].forEach(field => {
                initialData[field.key] = '';
            });
            setFormData(initialData);
        }
    }, []);

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        // Clear error for this field if user starts typing
        if (errors[key]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const fields = connectionFormFields[connectionType] || [];

        fields.forEach(field => {
            if (field.required && (!formData[field.key] || formData[field.key].trim() === '')) {
                newErrors[field.key] = `${field.label} is required`;
            }
            // Email validation
            if (field.type === 'email' && formData[field.key] && !formData[field.key].includes('@')) {
                newErrors[field.key] = 'Please enter a valid email address';
            }
            // Phone validation
            if (field.type === 'tel' && formData[field.key] && formData[field.key].length < 10) {
                newErrors[field.key] = 'Please enter a valid mobile number';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 2000);
    };

    const getConnectionTitle = () => {
        const titles = {
            electricity: 'Electricity Connection',
            water: 'Water Connection',
            gas: 'Gas Connection',
            waste: 'Waste Management Connection'
        };
        return titles[connectionType] || 'Connection Application';
    };

    if (!connectionType) {
        return (
            <div className="animate-fade-in">
                <div className="breadcrumb">
                    <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                    <span className="breadcrumb__separator">›</span>
                    <a onClick={() => navigate('/new-connection')} style={{ cursor: 'pointer' }}>New Connection</a>
                    <span className="breadcrumb__separator">›</span>
                    <span>Application Form</span>
                </div>
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <AlertCircle size={48} style={{ color: 'var(--error-color)', marginBottom: '1rem' }} />
                    <h2>Invalid Connection Type</h2>
                    <p>Please go back and select a valid connection type.</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => navigate('/new-connection')}
                        style={{ marginTop: '1rem' }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="animate-fade-in">
                <div className="breadcrumb">
                    <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                    <span className="breadcrumb__separator">›</span>
                    <a onClick={() => navigate('/new-connection')} style={{ cursor: 'pointer' }}>New Connection</a>
                    <span className="breadcrumb__separator">›</span>
                    <span>Application Submitted</span>
                </div>
                
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--success-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem'
                    }}>
                        <CheckCircle size={40} color="white" />
                    </div>
                    <h1 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>
                        Application Submitted Successfully!
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Your {getConnectionTitle()} application has been received.<br />
                        Application ID: <strong>CONN-{Date.now().toString().slice(-8)}</strong><br />
                        We will process your application within the stipulated time.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => navigate('/track-status')}
                        >
                            Track Application
                        </button>
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/dashboard')}
                        >
                            <Home size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const fields = connectionFormFields[connectionType] || [];

    return (
        <div className="animate-fade-in">
            <div className="breadcrumb">
                <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                <span className="breadcrumb__separator">›</span>
                <a onClick={() => navigate('/new-connection')} style={{ cursor: 'pointer' }}>New Connection</a>
                <span className="breadcrumb__separator">›</span>
                <span>Application Form</span>
            </div>

            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                {getConnectionTitle()} Application
            </h1>

            <div className="panel" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {fields.map((field) => (
                            <div key={field.key}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '0.5rem', 
                                    fontWeight: 500,
                                    color: errors[field.key] ? 'var(--error-color)' : 'var(--text-primary)'
                                }}>
                                    {field.label}
                                    {field.required && <span style={{ color: 'var(--error-color)' }}> *</span>}
                                </label>
                                
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: `1px solid ${errors[field.key] ? 'var(--error-color)' : 'var(--border-light)'}`,
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                ) : field.type === 'select' ? (
                                    <select
                                        value={formData[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: `1px solid ${errors[field.key] ? 'var(--error-color)' : 'var(--border-light)'}`,
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            backgroundColor: 'white'
                                        }}
                                    >
                                        <option value="">Select {field.label.toLowerCase()}</option>
                                        {field.options?.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: `1px solid ${errors[field.key] ? 'var(--error-color)' : 'var(--border-light)'}`,
                                            borderRadius: '8px',
                                            fontSize: '1rem'
                                        }}
                                    />
                                )}
                                
                                {errors[field.key] && (
                                    <p style={{ 
                                        color: 'var(--error-color)', 
                                        fontSize: '0.85rem', 
                                        marginTop: '0.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <AlertCircle size={12} />
                                        {errors[field.key]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'flex-end', 
                        marginTop: '2rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid var(--border-light)'
                    }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/new-connection')}
                        >
                            <ArrowLeft size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Back
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner" style={{ 
                                        display: 'inline-block', 
                                        width: '14px', 
                                        height: '14px', 
                                        border: '2px solid white', 
                                        borderTop: '2px solid transparent', 
                                        borderRadius: '50%', 
                                        animation: 'spin 1s linear infinite',
                                        marginRight: '0.5rem'
                                    }}></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
