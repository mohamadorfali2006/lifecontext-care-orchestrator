import React, { useState } from 'react';
import { Patient } from '../fhir/types';
import { ReferralTicket } from '../referrals/types';
import { PatientConsentRecord, ConsentScopeState } from '../consent/consent-manager';
import { 
  Heart, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Lock, 
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface PatientPortalProps {
  patient: Patient;
  consentRecord: PatientConsentRecord;
  referrals: ReferralTicket[];
  onToggleConsent: (scope: keyof ConsentScopeState, enabled: boolean) => void;
  onBackToClinicianView: () => void;
}

type SupportedLanguage = 'en' | 'es' | 'vi';

const TRANSLATIONS = {
  en: {
    title: 'My Care & Community Support',
    subtitle: 'Track your community care services and control what information is shared.',
    proxyNotice: 'Caregiver proxy active:',
    activeServices: 'Your Active Support Services',
    privacyTitle: 'Your Privacy & Sharing Permissions',
    privacySubtitle: 'You are in control. You can turn off sharing for any category at any time.',
    smsTitle: 'Simulated Phone SMS Updates',
    smsSubtitle: 'No smartphone or internet required. Patients receive these plain-text SMS messages:',
    noServices: 'No active services right now. Your care team can connect you with food, housing, or rides.',
    callSupport: 'Need help? Call your Community Care Navigator:',
    closeLoopConfirmed: 'Service successfully delivered! Thank you for confirming.'
  },
  es: {
    title: 'Mi Cuidado y Apoyo Comunitario',
    subtitle: 'Siga sus servicios de apoyo comunitario y controle qué información se comparte.',
    proxyNotice: 'Cuidador autorizado activo:',
    activeServices: 'Sus Servicios de Apoyo Activos',
    privacyTitle: 'Su Privacidad y Permisos para Compartir',
    privacySubtitle: 'Usted tiene el control. Puede desactivar el acceso en cualquier momento.',
    smsTitle: 'Actualizaciones por Mensaje de Texto (SMS)',
    smsSubtitle: 'No requiere teléfono inteligente ni internet. Recibe estos mensajes sencillos:',
    noServices: 'No hay servicios activos en este momento.',
    callSupport: '¿Necesita ayuda? Llame a su Navegador Comunitario:',
    closeLoopConfirmed: '¡Servicio entregado con éxito! Gracias por confirmar.'
  },
  vi: {
    title: 'Chăm Sóc & Hỗ Trợ Cộng Đồng Của Tôi',
    subtitle: 'Theo dõi các dịch vụ hỗ trợ cộng đồng và kiểm soát thông tin chia sẻ.',
    proxyNotice: 'Người chăm sóc được ủy quyền:',
    activeServices: 'Dịch Vụ Hỗ Trợ Đang Hoạt Động',
    privacyTitle: 'Quyền Riêng Tư & Chia Sẻ Thông Tin',
    privacySubtitle: 'Bạn có toàn quyền kiểm soát. Bạn có thể tắt chia sẻ bất cứ lúc nào.',
    smsTitle: 'Cập Nhật Tin Nhắn SMS Mô Phỏng',
    smsSubtitle: 'Không cần điện thoại thông minh hay mạng internet. Bạn sẽ nhận tin nhắn:',
    noServices: 'Hiện tại chưa có dịch vụ nào đang hoạt động.',
    callSupport: 'Cần giúp đỡ? Gọi cho Điều Phối Viên Cộng Đồng:',
    closeLoopConfirmed: 'Dịch vụ đã được giao thành công!'
  }
};

export const PatientPortal: React.FC<PatientPortalProps> = ({
  patient,
  consentRecord,
  referrals,
  onToggleConsent,
  onBackToClinicianView
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const t = TRANSLATIONS[lang];

  const patientReferrals = referrals.filter(r => r.patientId === patient.id);

  return (
    <div className="patient-portal-wrapper">
      {/* Navigation & Language Picker */}
      <div className="patient-top-bar">
        <button className="btn-back" onClick={onBackToClinicianView}>
          ← Return to Clinician Chart
        </button>
        <div className="language-selector">
          <Globe size={16} />
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
          <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>Español</button>
          <button className={`lang-btn ${lang === 'vi' ? 'active' : ''}`} onClick={() => setLang('vi')}>Tiếng Việt</button>
        </div>
      </div>

      {/* Hero Welcome */}
      <div className="patient-hero">
        <div className="hero-icon">
          <Heart size={32} color="#0284c7" />
        </div>
        <div className="hero-text">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
          {consentRecord.proxyCaregiverAuthorized && (
            <div className="proxy-banner">
              <ShieldCheck size={16} color="#059669" />
              <span>{t.proxyNotice} <strong>{consentRecord.proxyName || 'Authorized Caregiver'}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="patient-portal-grid">
        {/* Active Referrals / Service Timeline */}
        <div className="portal-col">
          <div className="patient-card">
            <div className="card-header-styled">
              <Clock size={18} color="#0284c7" />
              <h3>{t.activeServices}</h3>
            </div>

            {patientReferrals.length === 0 ? (
              <p className="empty-notice">{t.noServices}</p>
            ) : (
              <div className="services-stream">
                {patientReferrals.map(ticket => (
                  <div key={ticket.id} className="patient-service-item">
                    <div className="service-top">
                      <h4>{ticket.targetService.name}</h4>
                      <span className={`patient-badge status-${ticket.status.toLowerCase()}`}>
                        {ticket.status === 'FULFILLED' ? (
                          <><CheckCircle2 size={13} /> Completed</>
                        ) : (
                          <><Clock size={13} /> {ticket.status}</>
                        )}
                      </span>
                    </div>
                    <p className="service-desc">{ticket.targetService.description}</p>
                    
                    <div className="service-steps">
                      <div className={`step-dot ${['INITIATED', 'ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'done' : ''}`}>
                        <span>Ordered</span>
                      </div>
                      <div className={`step-line ${['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'done' : ''}`} />
                      <div className={`step-dot ${['ACCEPTED', 'SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'done' : ''}`}>
                        <span>Accepted</span>
                      </div>
                      <div className={`step-line ${['SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'done' : ''}`} />
                      <div className={`step-dot ${['SCHEDULED', 'IN_PROGRESS', 'FULFILLED'].includes(ticket.status) ? 'done' : ''}`}>
                        <span>Scheduled</span>
                      </div>
                      <div className={`step-line ${ticket.status === 'FULFILLED' ? 'done' : ''}`} />
                      <div className={`step-dot ${ticket.status === 'FULFILLED' ? 'done' : ''}`}>
                        <span>Delivered</span>
                      </div>
                    </div>

                    {ticket.status === 'FULFILLED' && (
                      <div className="fulfillment-box">
                        <CheckCircle2 size={16} color="#059669" />
                        <span>{t.closeLoopConfirmed}</span>
                      </div>
                    )}

                    <div className="service-contact">
                      <Phone size={13} />
                      <span>{t.callSupport} <strong>{ticket.targetService.contactPhone}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Granular Consent & Privacy Settings */}
        <div className="portal-col">
          <div className="patient-card">
            <div className="card-header-styled">
              <Lock size={18} color="#059669" />
              <h3>{t.privacyTitle}</h3>
            </div>
            <p className="privacy-intro">{t.privacySubtitle}</p>

            <div className="consent-toggles-list">
              <div className="toggle-row">
                <div>
                  <strong>Food & Meal Support</strong>
                  <p className="text-muted text-sm">Share food insecurity need with local food pantries</p>
                </div>
                <button
                  className="btn-toggle"
                  onClick={() => onToggleConsent('food-insecurity', !consentRecord.scopes['food-insecurity'])}
                >
                  {consentRecord.scopes['food-insecurity'] ? <ToggleRight size={28} color="#059669" /> : <ToggleLeft size={28} color="#94a3b8" />}
                </button>
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Transportation Support</strong>
                  <p className="text-muted text-sm">Share clinic ride appointments with NEMT transit drivers</p>
                </div>
                <button
                  className="btn-toggle"
                  onClick={() => onToggleConsent('transportation-insecurity', !consentRecord.scopes['transportation-insecurity'])}
                >
                  {consentRecord.scopes['transportation-insecurity'] ? <ToggleRight size={28} color="#059669" /> : <ToggleLeft size={28} color="#94a3b8" />}
                </button>
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Housing & Shelter Support</strong>
                  <p className="text-muted text-sm">Share housing assistance need with eviction diversion partners</p>
                </div>
                <button
                  className="btn-toggle"
                  onClick={() => onToggleConsent('housing-instability', !consentRecord.scopes['housing-instability'])}
                >
                  {consentRecord.scopes['housing-instability'] ? <ToggleRight size={28} color="#059669" /> : <ToggleLeft size={28} color="#94a3b8" />}
                </button>
              </div>

              <div className="toggle-row">
                <div>
                  <strong>Senior & Peer Outreach</strong>
                  <p className="text-muted text-sm">Allow weekly check-in calls from Community Health Workers</p>
                </div>
                <button
                  className="btn-toggle"
                  onClick={() => onToggleConsent('social-isolation', !consentRecord.scopes['social-isolation'])}
                >
                  {consentRecord.scopes['social-isolation'] ? <ToggleRight size={28} color="#059669" /> : <ToggleLeft size={28} color="#94a3b8" />}
                </button>
              </div>

              <div className="toggle-row highlight-part2">
                <div>
                  <strong>Behavioral Health / Substance Use (42 CFR Part 2)</strong>
                  <p className="text-muted text-sm">Requires strict explicit consent. Default: Blocked.</p>
                </div>
                <button
                  className="btn-toggle"
                  onClick={() => onToggleConsent('behavioral-health-part2', !consentRecord.scopes['behavioral-health-part2'])}
                >
                  {consentRecord.scopes['behavioral-health-part2'] ? <ToggleRight size={28} color="#dc2626" /> : <ToggleLeft size={28} color="#94a3b8" />}
                </button>
              </div>
            </div>

            <div className="token-footer">
              <ShieldCheck size={14} color="#059669" />
              <span>Consent Token ID: <code>{consentRecord.tokenId}</code></span>
            </div>
          </div>

          {/* Simulated SMS Low-Bandwidth Fallback Channel */}
          <div className="patient-card sms-card">
            <div className="card-header-styled">
              <Smartphone size={18} color="#6366f1" />
              <h3>{t.smsTitle}</h3>
            </div>
            <p className="text-muted text-sm">{t.smsSubtitle}</p>

            <div className="sms-device-frame">
              <div className="sms-bubble from-care">
                <span className="bubble-sender">LifeContext Health Alert (555-0199)</span>
                <p>Hello {patient.name[0]?.given?.[0]}, Dr. Jenkins connected you with Metro Food Bank. Delivery scheduled for Thursday between 10am-1pm. Reply YES to confirm, or call (555) 321-4567.</p>
                <span className="bubble-time">10:14 AM</span>
              </div>
              <div className="sms-bubble from-patient">
                <p>YES</p>
                <span className="bubble-time">10:16 AM</span>
              </div>
              <div className="sms-bubble from-care">
                <p>Confirmed! Your food box is on the way. Reply HELP for support or STOP to cancel sharing.</p>
                <span className="bubble-time">10:16 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
