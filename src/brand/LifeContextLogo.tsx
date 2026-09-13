import React from 'react';

interface LifeContextLogoProps {
  size?: number;
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'glass';
}

export const LifeContextLogo: React.FC<LifeContextLogoProps> = ({
  size = 36,
  showTagline = true,
  variant = 'light'
}) => {
  const isDark = variant === 'dark';

  return (
    <div className="lifecontext-brand-lockup">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg-mark"
      >
        <defs>
          <linearGradient id="lc-gradient-clinical" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0891B2" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="lc-gradient-social" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="lc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Closed-Loop Track */}
        <circle
          cx="24"
          cy="24"
          r="21"
          stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(8, 145, 178, 0.18)'}
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* Clinical Care Loop (Left Node) */}
        <path
          d="M16 16C12 20 12 28 16 32C20 36 28 32 32 24"
          stroke="url(#lc-gradient-clinical)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Social Determinants Loop (Right Node - Interlocking) */}
        <path
          d="M32 32C36 28 36 20 32 16C28 12 20 16 16 24"
          stroke="url(#lc-gradient-social)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Central Orchestration Nexus Point */}
        <circle cx="24" cy="24" r="3.5" fill="#0891B2" filter="url(#lc-glow)" />
        <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />

        {/* Pulse Indicators */}
        <circle cx="16" cy="16" r="2" fill="#0284C7" />
        <circle cx="32" cy="32" r="2" fill="#10B981" />
      </svg>

      <div className="brand-text-block">
        <div className="brand-name-row">
          <span className={`brand-title-main ${isDark ? 'text-white' : ''}`}>LifeContext</span>
          <span className="brand-os-badge">OS™</span>
        </div>
        {showTagline && (
          <span className="brand-sub-tagline">Closed-Loop Clinical & Social Orchestration</span>
        )}
      </div>
    </div>
  );
};
