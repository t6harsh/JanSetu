import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Printer, Eye, Clock } from 'lucide-react';

const mockDocuments = [
    { id: 'RCT-2026-001', name: 'Electricity Bill Receipt', type: 'Receipt', date: '18 Feb 2026', amount: '₹2,340', format: 'PDF' },
    { id: 'RCT-2026-002', name: 'Water Bill Receipt', type: 'Receipt', date: '01 Feb 2026', amount: '₹450', format: 'PDF' },
    { id: 'CERT-2026-001', name: 'Property Tax Clearance Certificate', type: 'Certificate', date: '15 Jan 2026', amount: '—', format: 'PDF' },
    { id: 'GRV-ACK-001', name: 'Grievance Acknowledgment', type: 'Acknowledgment', date: '22 Feb 2026', amount: '—', format: 'PDF' },
    { id: 'RCT-2025-014', name: 'Gas Bill Receipt', type: 'Receipt', date: '20 Dec 2025', amount: '₹890', format: 'PDF' },
    { id: 'STMT-2026-001', name: 'Annual Consumption Summary', type: 'Statement', date: '01 Jan 2026', amount: '—', format: 'PDF' },
];

const typeColors = {
    Receipt: { bg: '#E6FFED', color: '#28A745' },
    Certificate: { bg: '#EBF5FF', color: '#0B5394' },
    Acknowledgment: { bg: '#FFF3CD', color: '#856404' },
    Statement: { bg: '#F3E8FF', color: '#805AD5' },
};

export default function MyDocuments() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <div className="breadcrumb">
                <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>{t('home')}</a>
                <span className="breadcrumb__separator">›</span>
                <span>{t('service_documents')}</span>
            </div>

            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>{t('service_documents')}</h1>

            <div className="panel">
                <table className="complaints-table" style={{ minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockDocuments.map((doc) => {
                            const tc = typeColors[doc.type] || typeColors.Receipt;
                            return (
                                <tr key={doc.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FileText size={18} color="var(--corporate-blue)" />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{doc.name}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{doc.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ background: tc.bg, color: tc.color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Clock size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                        {doc.date}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{doc.amount}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                                                <Eye size={14} /> View
                                            </button>
                                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                                                <Download size={14} />
                                            </button>
                                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                                                <Printer size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
