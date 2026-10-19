import React from 'react';
import { Globe } from 'lucide-react';

interface AppleFooterProps {
  onNavigate?: (route: string, param?: string) => void;
}

const REGIONAL_LANGUAGES = [
  'India',
  'हिंदी',
  'ਪੰਜਾਬੀ',
  'मराठी',
  'বাংলা',
  'ଓଡ଼ିଆ',
  'اردو',
  'తెలుగు',
  'தமிழ்',
  'ગુજરાતી',
  'ಕನ್ನಡ',
  'മലയാളം'
];

export const AppleFooter: React.FC<AppleFooterProps> = () => {
  return (
    <footer className="apple-official-footer" role="contentinfo">
      {/* 1. Regional Languages Strip (Matching authentic Apple Music web footer) */}
      <div className="footer-languages-strip">
        <div className="languages-scroll-container">
          {REGIONAL_LANGUAGES.map((lang, index) => (
            <React.Fragment key={lang}>
              <span className={`lang-pill ${index === 0 ? 'lang-primary' : ''}`}>
                {index === 0 && <Globe size={11} className="lang-globe-icon" />}
                {lang}
              </span>
              {index < REGIONAL_LANGUAGES.length - 1 && (
                <span className="lang-separator" aria-hidden="true">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="footer-main-divider" />

      {/* 2. Copyright line */}
      <div className="footer-copyright-row">
        Copyright © 2026 <strong>Nocturne</strong>. All rights reserved.
      </div>

      {/* 3. Replaced bottom line: Developer | Repository | License formatted exactly like Apple Terms */}
      <div className="footer-bottom-links">
        <span className="footer-link-group">
          Developer:{' '}
          <a
            href="https://github.com/mudassir131-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-nav-link"
            title="mudassir131-dev on GitHub"
          >
            mudassir131-dev
          </a>
        </span>

        <span className="link-divider" aria-hidden="true">|</span>

        <span className="footer-link-group">
          Repository:{' '}
          <a
            href="https://github.com/mudassir131-dev/nocturne-web.git"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-nav-link"
            title="mudassir131-dev/nocturne-web repository"
          >
            nocturne-web
          </a>
        </span>

        <span className="link-divider" aria-hidden="true">|</span>

        <span className="footer-link-group">
          License:{' '}
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.en.html"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-nav-link"
            title="GNU General Public License v3.0"
          >
            GPL v3
          </a>
        </span>
      </div>

      <style>{`
        .apple-official-footer {
          margin-top: 56px;
          padding: 24px 36px 148px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
          user-select: none;
          transition: border-color var(--transition-fast);
          position: relative;
          z-index: 5;
        }

        [data-theme="light"] .apple-official-footer {
          border-top-color: rgba(0, 0, 0, 0.09);
        }

        /* 1. Languages Strip */
        .footer-languages-strip {
          margin-bottom: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .footer-languages-strip::-webkit-scrollbar {
          display: none;
        }

        .languages-scroll-container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.55);
          white-space: nowrap;
        }

        [data-theme="light"] .languages-scroll-container {
          color: #6e6e73;
        }

        .lang-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .lang-pill:hover {
          color: #ffffff;
        }

        [data-theme="light"] .lang-pill:hover {
          color: #1c1c1e;
        }

        .lang-primary {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }

        [data-theme="light"] .lang-primary {
          color: #1c1c1e;
        }

        .lang-globe-icon {
          opacity: 0.8;
        }

        .lang-separator {
          color: rgba(255, 255, 255, 0.2);
          font-size: 10px;
        }

        [data-theme="light"] .lang-separator {
          color: rgba(0, 0, 0, 0.15);
        }

        .footer-main-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin-bottom: 16px;
        }

        [data-theme="light"] .footer-main-divider {
          background: rgba(0, 0, 0, 0.06);
        }

        /* 2. Copyright Row */
        .footer-copyright-row {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.4;
          margin-bottom: 10px;
        }

        .footer-copyright-row strong {
          color: rgba(255, 255, 255, 0.75);
          font-weight: 600;
        }

        [data-theme="light"] .footer-copyright-row {
          color: #8e8e93;
        }

        [data-theme="light"] .footer-copyright-row strong {
          color: #1c1c1e;
        }

        /* 3. Bottom Row: Developer | Repository | License (Exact Apple Terms look) */
        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.50);
          line-height: 1.5;
        }

        [data-theme="light"] .footer-bottom-links {
          color: #6e6e73;
        }

        .footer-link-group {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
        }

        .footer-nav-link {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s ease, text-decoration 0.15s ease;
        }

        .footer-nav-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        [data-theme="light"] .footer-nav-link {
          color: #1c1c1e;
        }

        [data-theme="light"] .footer-nav-link:hover {
          color: #000000;
        }

        .link-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 11px;
        }

        [data-theme="light"] .link-divider {
          color: rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .apple-official-footer {
            padding: 20px 16px 148px;
            margin-top: 40px;
          }

          .footer-bottom-links {
            gap: 8px;
          }
        }
      `}</style>
    </footer>
  );
};

export default AppleFooter;
