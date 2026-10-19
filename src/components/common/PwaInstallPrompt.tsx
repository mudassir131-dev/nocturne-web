import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Check, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window);
    setIsIOS(isIOSDevice);

    // Capture Android / Desktop PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstallSuccess(true);
      setDeferredPrompt(null);
      setTimeout(() => setInstallSuccess(false), 4000);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // If already running inside standalone app, don't show install button
  if (isStandalone) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallSuccess(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('Install prompt failed:', err);
      }
    } else {
      // Fallback instruction for browsers where deferredPrompt isn't available
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        className="pwa-install-trigger-btn"
        onClick={handleInstallClick}
        title="Download / Install Nocturne App on iOS & Android"
        aria-label="Download App"
      >
        {installSuccess ? (
          <>
            <Check size={15} color="#34c759" />
            <span className="install-label-text">Installed</span>
          </>
        ) : (
          <>
            <Download size={15} className="install-icon-spin" />
            <span className="install-label-text">Download App</span>
          </>
        )}
      </button>

      {/* iOS & Mobile Add-to-Home-Screen Step-by-Step Modal */}
      {showIOSModal && (
        <div className="ios-install-backdrop" onClick={() => setShowIOSModal(false)}>
          <div className="ios-install-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="ios-sheet-header">
              <div className="ios-app-branding">
                <img src="/app-icon.png" alt="Nocturne Icon" className="ios-sheet-app-icon" />
                <div className="ios-app-titles">
                  <h3 className="ios-sheet-title">Install Nocturne</h3>
                  <p className="ios-sheet-subtitle">Lossless Audio & Offline Player</p>
                </div>
              </div>
              <button
                className="ios-sheet-close-btn"
                onClick={() => setShowIOSModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ios-steps-list">
              {isIOS ? (
                <>
                  <div className="ios-step-row">
                    <div className="ios-step-badge">1</div>
                    <div className="ios-step-info">
                      <p className="ios-step-main">
                        Tap the <strong>Share button</strong> in Safari’s bottom toolbar.
                      </p>
                      <div className="ios-icon-hint">
                        <Share size={18} color="#007aff" />
                        <span>Share icon</span>
                      </div>
                    </div>
                  </div>

                  <div className="ios-step-row">
                    <div className="ios-step-badge">2</div>
                    <div className="ios-step-info">
                      <p className="ios-step-main">
                        Scroll down and tap <strong>Add to Home Screen</strong>.
                      </p>
                      <div className="ios-icon-hint">
                        <PlusSquare size={18} color="#007aff" />
                        <span>Add to Home Screen</span>
                      </div>
                    </div>
                  </div>

                  <div className="ios-step-row">
                    <div className="ios-step-badge">3</div>
                    <div className="ios-step-info">
                      <p className="ios-step-main">
                        Tap <strong>Add</strong> in the top right corner. Done!
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="ios-step-row">
                    <div className="ios-step-badge">
                      <Smartphone size={16} />
                    </div>
                    <div className="ios-step-info">
                      <p className="ios-step-main">
                        Tap your browser menu (<strong>⋮</strong> or <strong>Share</strong>) and select <strong>Install App</strong> or <strong>Add to Home screen</strong>.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button className="ios-sheet-done-btn" onClick={() => setShowIOSModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        .pwa-install-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 32px;
          padding: 0 12px 0 9px;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: var(--text-primary);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: -0.01em;
          cursor: pointer;
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        [data-theme="light"] .pwa-install-trigger-btn {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.04) 100%);
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .pwa-install-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.24);
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }

        [data-theme="light"] .pwa-install-trigger-btn:hover {
          background: rgba(0, 0, 0, 0.12);
        }

        .pwa-install-trigger-btn:active {
          transform: scale(0.96);
        }

        .install-icon-spin {
          transition: transform 0.3s ease;
        }

        .pwa-install-trigger-btn:hover .install-icon-spin {
          transform: translateY(1.5px);
        }

        /* iOS Bottom Sheet Modal */
        .ios-install-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: iosBackdropFade 0.25s ease-out;
        }

        @keyframes iosBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .ios-install-sheet {
          width: min(440px, 100vw);
          background: var(--player-bg, #1c1c1e);
          border-radius: 24px 24px 0 0;
          padding: 24px 22px calc(24px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.6);
          animation: iosSheetSlide 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--text-primary);
        }

        [data-theme="light"] .ios-install-sheet {
          background: #ffffff;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.12);
        }

        @keyframes iosSheetSlide {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .ios-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .ios-app-branding {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ios-sheet-app-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          object-fit: contain;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
        }

        .ios-sheet-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
          line-height: 1.2;
        }

        .ios-sheet-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
          margin: 2px 0 0;
        }

        .ios-sheet-close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          cursor: pointer;
        }

        [data-theme="light"] .ios-sheet-close-btn {
          background: rgba(0, 0, 0, 0.06);
        }

        .ios-steps-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .ios-step-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="light"] .ios-step-row {
          background: rgba(0, 0, 0, 0.03);
        }

        .ios-step-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--text-primary);
          color: var(--bg-primary);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ios-step-info {
          flex: 1;
        }

        .ios-step-main {
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
        }

        .ios-icon-hint {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(0, 122, 255, 0.14);
          font-size: 12px;
          font-weight: 600;
          color: #007aff;
        }

        .ios-sheet-done-btn {
          width: 100%;
          height: 48px;
          border-radius: 9999px;
          background: var(--text-primary);
          color: var(--bg-primary);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .ios-sheet-done-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};
