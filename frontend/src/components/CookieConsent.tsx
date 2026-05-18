import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/cookie-consent.css';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Siempre obligatorias
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('muin_cookie_consent');
    if (!saved) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object') {
          setPreferences(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // En caso de que se haya guardado solo un string en la versión anterior
      }
    }
  }, []);

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
        <button className="cookie-floating-btn" onClick={handleOpenConsent} title="Configurar Cookies">
          <span className="material-symbols-outlined">cookie</span>
        </button>
      )}

      {isVisible && (
        <div className="cookie-consent-overlay">
          <div className="cookie-consent-modal">
            {!showPreferences ? (
              <>
                <h2>Bienvenido a MUIN</h2>
                <p>
                  Utilizamos cookies propias y de terceros para garantizar el correcto funcionamiento de nuestra web y analizar la navegación para mejorar tu experiencia. Al hacer clic en "Aceptar Todo", confirmas que has leído y aceptas nuestra <Link to="/cookies-policy">Política de Cookies</Link>, la <Link to="/privacy-policy">Política de Privacidad</Link> y los <Link to="/privacy-terms">Términos de Privacidad</Link>.
                </p>
                <div className="cookie-consent-actions">
                  <button className="btn-accept" onClick={handleAcceptAll}>Aceptar Todo</button>
                  <button className="btn-reject" onClick={handleRejectAll}>Rechazar Todo</button>
                  <button className="btn-config" onClick={() => setShowPreferences(true)}>Configurar Cookies</button>
                </div>
              </>
            ) : (
              <>
                <h2>Configuración de Cookies</h2>
                <p className="preferences-desc">
                  Selecciona qué tipo de cookies permites que utilicemos durante tu visita.
                </p>
                
                <div className="cookie-options">
                  <div className="cookie-option">
                    <div className="cookie-option-header">
                      <h3>Cookies Esenciales</h3>
                      <input type="checkbox" checked={true} disabled className="toggle-checkbox" />
                    </div>
                    <p>Son estrictamente necesarias para que la web funcione correctamente (inicio de sesión, carrito de compra, seguridad). No se pueden desactivar.</p>
                  </div>

                  <div className="cookie-option">
                    <div className="cookie-option-header">
                      <h3>Cookies de Análisis</h3>
                      <label className="switch">
                        <input type="checkbox" checked={preferences.analytics} onChange={() => togglePreference('analytics')} />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    <p>Nos ayudan a entender cómo interactúas con la web (visitas, fuentes de tráfico) para mejorar el rendimiento y la experiencia de usuario.</p>
                  </div>

                  <div className="cookie-option">
                    <div className="cookie-option-header">
                      <h3>Cookies de Marketing</h3>
                      <label className="switch">
                        <input type="checkbox" checked={preferences.marketing} onChange={() => togglePreference('marketing')} />
                        <span className="slider round"></span>
                      </label>
                    </div>
                    <p>Se utilizan para rastrear a los visitantes a través de las webs y mostrar anuncios relevantes para el usuario individual.</p>
                  </div>
                </div>

                <div className="cookie-consent-actions prefs-actions">
                  <button className="btn-save" onClick={handleSavePreferences}>Guardar Preferencias</button>
                  <button className="btn-back" onClick={() => setShowPreferences(false)}>Volver</button>
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
