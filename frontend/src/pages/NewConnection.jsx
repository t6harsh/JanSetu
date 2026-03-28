import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, ArrowLeft, Home, Zap, Flame, Droplets, Trash2, Landmark, CheckCircle, Clock, FileText } from 'lucide-react';

const connectionTypes = [
    {
        key: 'electricity',
        icon: Zap,
        title: 'Electricity Connection',
        description: 'New electricity connection for residential, commercial, or industrial use',
        processingTime: '7-10 working days',
        documents: ['Aadhaar Card', 'Address Proof', 'Property Papers', 'No Objection Certificate']
    },
    {
        key: 'water',
        icon: Droplets,
        title: 'Water Connection',
        description: 'New water connection for domestic and commercial purposes',
        processingTime: '5-7 working days',
        documents: ['Aadhaar Card', 'Address Proof', 'Property Tax Receipt', 'Water Undertaking']
    },
    {
        key: 'gas',
        icon: Flame,
        title: 'Gas Connection',
        description: 'New PNG/LPG gas connection for household and commercial establishments',
        processingTime: '10-14 working days',
        documents: ['Aadhaar Card', 'Address Proof', 'Kitchen Layout', 'Safety Certificate']
    },
    {
        key: 'waste',
        icon: Trash2,
        title: 'Waste Management',
        description: 'Waste collection and disposal services for residential and commercial areas',
        processingTime: '3-5 working days',
        documents: ['Aadhaar Card', 'Address Proof', 'Property Details', 'Waste Generation Estimate']
    }
];

export default function NewConnection() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState('');

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const handleProceed = () => {
        if (selectedType) {
            navigate(`/connection-form?type=${selectedType}`);
        }
    };

    const selectedConnection = connectionTypes.find(c => c.key === selectedType);

    return (
        <div className="animate-fade-in">
            <div className="breadcrumb">
                <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                <span className="breadcrumb__separator">›</span>
                <span>{t('new_connection')}</span>
            </div>

            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>{t('new_connection')}</h1>

            {!selectedType ? (
                <>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Select the type of connection you want to apply for
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        {connectionTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <div
                                    key={type.key}
                                    className="panel"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        border: selectedType === type.key ? '2px solid var(--corporate-blue)' : '1px solid var(--border-light)'
                                    }}
                                    onClick={() => handleTypeSelect(type.key)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: 'var(--corporate-blue)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Icon size={24} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                                                {type.title}
                                            </h3>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {type.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <Clock size={14} />
                                        <span>{type.processingTime}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <>
                    <div className="panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: 'var(--corporate-blue)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {selectedConnection && <selectedConnection.icon size={28} color="white" />}
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
                                    {selectedConnection?.title}
                                </h2>
                                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                                    {selectedConnection?.description}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                            <div>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--corporate-blue)' }}>
                                    <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Processing Time
                                </h4>
                                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                                    {selectedConnection?.processingTime}
                                </p>
                            </div>

                            <div>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--corporate-blue)' }}>
                                    <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    Required Documents
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                                    {selectedConnection?.documents.map((doc, index) => (
                                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setSelectedType('')}
                        >
                            <ArrowLeft size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Back
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleProceed}
                        >
                            <Plus size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Proceed with Application
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
