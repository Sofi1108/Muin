import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/cookie-consent.css';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const location = useLocation();
  const [preferences, setPreferences] = useState({
    essential: true, // Siempre obligatorias
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('muin_cookie_consent');
    if (!saved) {
      if (location.pathname === '/') {
        setIsVisible(true);
      }
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          setPreferences(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // En caso de que se haya guardado solo un string en la versión anterior
      }
    }
  }, [location.pathname]);

  const savePreferences = (prefs: any) => {
    localStorage.setItem('muin_cookie_consent', JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenConsent = () => {
    setIsVisible(true);
    setShowPreferences(false);
  };

  return (
    <>
      {!isVisible && (
        <button className="cookie-floating-btn" onClick={handleOpenConsent} title="Cookie Settings">
          <span className="material-symbols-outlined">cookie</span>
        </button>
      )}

      {isVisible && (
        <div className="cookie-consent-overlay">
          <div className="cookie-consent-modal">
            {!showPreferences ? (
              <>
                <h2>Welcome to MUIN</h2>
                <p>
                  We use our own and third-party cookies to ensure the proper functioning of our website and analyze navigation to improve your experience. By clicking "Accept All", you confirm that you have read and accept our <Link to="/cookies-policy">Cookie Policy</Link>, the <Link to="/privacy-policy">Privacy Policy</Link> and the <Link to="/privacy-terms">Privacy Terms</Link>.
                </p>
                <div className="cookie-consent-actions">
                  <button className="btn-accept" onClick={handleAcceptAll}>Accept All</button>
                  <button className="btn-reject" onClick={handleRejectAll}>Reject All</button>
                  <button className="btn-config" onClick={() => setShowPreferences(true)}>Cookie Settings</button>
                </div>
              </>
            ) : (
              <>
                <h2>Cookie Settings</h2>
                <p className="preferences-desc">
                  Select which types of cookies you allow us to use during your visit.
                </p>
                
                <div className="cookie-options">
                  <div className="cookie-option">
                    <div className="cookie-option-header">
                      <h3>Essential Cookies</h3>
                      <input type="checkbox" checked={true} disabled className="toggle-checkbox" />
                    </div>
                    <p>These are strictly necessary for the website to function properly (login, shopping cart, security). They cannot be disabled.</p>
                  </div>

                  <div className="cookie-option">
                    <div className="cookie-option-header">
                      <h3>Analytics Cookies</h3>
                      <label className="switch">
                        <input type="checkbox" checked={preferences.analytics} onChange={() => togglePreference('analytics')} />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    <p>These help us understand how you interact with the website (visits, traffic sources) to improve performance and user experience.</p>
                  </div>

                  <div className="cookie-option">
                    <div className="cookie-option-header">
                      <h3>Marketing Cookies</h3>
                      <label className="switch">
                        <input type="checkbox" checked={preferences.marketing} onChange={() => togglePreference('marketing')} />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    <p>These are used to track visitors across websites and display relevant ads for the individual user.</p>
                  </div>
                </div>

                <div className="cookie-consent-actions prefs-actions">
                  <button className="btn-save" onClick={handleSavePreferences}>Save Preferences</button>
                  <button className="btn-back" onClick={() => setShowPreferences(false)}>Back</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
