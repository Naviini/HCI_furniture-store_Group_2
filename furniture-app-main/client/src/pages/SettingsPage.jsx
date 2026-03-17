import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import './SettingsPage.css';

const fontOptions = [90, 100, 110, 120];

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`sp-toggle${checked ? ' is-on' : ''}`}
      onClick={onChange}
      aria-pressed={checked}
      aria-label={label}
    >
      <span className="sp-toggle-thumb" />
    </button>
  );
}

function RowChevron() {
  return <span className="sp-chevron" aria-hidden="true">&gt;</span>;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem('nd-font-scale') || 100));
  const [offlineMode, setOfflineMode] = useState(() => localStorage.getItem('nd-offline-mode') === 'true');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('nd-reduced-motion') === 'true');
  const [compactUi, setCompactUi] = useState(() => localStorage.getItem('nd-compact-ui') === 'true');
  const [unit, setUnit] = useState(() => localStorage.getItem('nd-unit') || 'Meters (m)');
  const [catalogCountry, setCatalogCountry] = useState(() => localStorage.getItem('nd-country') || 'Sri Lanka');
  const [language, setLanguage] = useState(() => localStorage.getItem('nd-language') || 'English');

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    localStorage.setItem('nd-font-scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('nd-reduced-motion', reducedMotion ? 'true' : 'false');
    document.body.classList.toggle('nd-reduced-motion', reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('nd-compact-ui', compactUi ? 'true' : 'false');
    document.body.classList.toggle('nd-compact-ui', compactUi);
  }, [compactUi]);

  useEffect(() => {
    localStorage.setItem('nd-offline-mode', offlineMode ? 'true' : 'false');
  }, [offlineMode]);

  useEffect(() => {
    localStorage.setItem('nd-unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('nd-country', catalogCountry);
  }, [catalogCountry]);

  useEffect(() => {
    localStorage.setItem('nd-language', language);
  }, [language]);

  const setThemeMode = (mode) => {
    if ((mode === 'dark' && !isDark) || (mode === 'light' && isDark)) {
      toggleTheme();
    }
  };

  return (
    <div className={`sp-page${isDark ? '' : ' sp-page--light'}`}>
      <main className="sp-shell">
        <header className="sp-header">
          <button type="button" className="sp-back" onClick={() => navigate('/home')}>Back</button>
          <h1>Settings</h1>
          <div className="sp-header-gap" />
        </header>

        <section className="sp-section">
          <h2>My Profile</h2>
          <div className="sp-list">
            <button type="button" className="sp-row sp-row--action" onClick={() => navigate('/login')}>
              <div className="sp-icon sp-icon--green">in</div>
              <div className="sp-row-main">
                <strong>Sign in</strong>
              </div>
            </button>

            <button type="button" className="sp-row sp-row--action">
              <div className="sp-icon sp-icon--green">PRO</div>
              <div className="sp-row-main">
                <strong>Manage plan</strong>
              </div>
              <RowChevron />
            </button>
          </div>
        </section>

        <section className="sp-section">
          <h2>General</h2>
          <div className="sp-list">
            <div className="sp-row">
              <div className="sp-icon">U</div>
              <div className="sp-row-main">
                <strong>Units</strong>
                <p>{unit}</p>
              </div>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="sp-select" aria-label="Units">
                <option>Meters (m)</option>
                <option>Feet (ft)</option>
              </select>
            </div>

            <div className="sp-row">
              <div className="sp-icon">C</div>
              <div className="sp-row-main">
                <strong>Catalog Country</strong>
                <p>{catalogCountry}</p>
              </div>
              <select value={catalogCountry} onChange={(e) => setCatalogCountry(e.target.value)} className="sp-select" aria-label="Catalog Country">
                <option>Sri Lanka</option>
                <option>India</option>
                <option>UAE</option>
                <option>United Kingdom</option>
              </select>
            </div>

            <div className="sp-row">
              <div className="sp-icon">A</div>
              <div className="sp-row-main">
                <strong>Appearance Mode</strong>
                <p>Switch dark/light theme across the app</p>
              </div>
              <div className="sp-mode-group">
                <button
                  type="button"
                  className={`sp-mode-btn${isDark ? ' is-active' : ''}`}
                  onClick={() => setThemeMode('dark')}
                >
                  Dark
                </button>
                <button
                  type="button"
                  className={`sp-mode-btn${!isDark ? ' is-active' : ''}`}
                  onClick={() => setThemeMode('light')}
                >
                  Light
                </button>
              </div>
            </div>

            <div className="sp-row">
              <div className="sp-icon">F</div>
              <div className="sp-row-main">
                <strong>Font Size</strong>
                <p>{fontScale}% scaling</p>
              </div>
              <div className="sp-font-group">
                {fontOptions.map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={`sp-font-btn${fontScale === size ? ' is-active' : ''}`}
                    onClick={() => setFontScale(size)}
                  >
                    {size}%
                  </button>
                ))}
              </div>
            </div>

            <div className="sp-row">
              <div className="sp-icon">L</div>
              <div className="sp-row-main">
                <strong>Language</strong>
                <p>{language}</p>
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="sp-select" aria-label="Language">
                <option>English</option>
                <option>Sinhala</option>
                <option>Tamil</option>
              </select>
            </div>

            <div className="sp-row">
              <div className="sp-icon">R</div>
              <div className="sp-row-main">
                <strong>Reduced Motion</strong>
                <p>Minimize animations for better comfort</p>
              </div>
              <ToggleSwitch
                checked={reducedMotion}
                onChange={() => setReducedMotion((prev) => !prev)}
                label="Toggle reduced motion"
              />
            </div>

            <div className="sp-row">
              <div className="sp-icon">D</div>
              <div className="sp-row-main">
                <strong>Compact UI</strong>
                <p>Show denser spacing in key interfaces</p>
              </div>
              <ToggleSwitch
                checked={compactUi}
                onChange={() => setCompactUi((prev) => !prev)}
                label="Toggle compact UI"
              />
            </div>

            <div className="sp-row">
              <div className="sp-icon">O</div>
              <div className="sp-row-main">
                <strong>Offline mode</strong>
                <p>Work without internet anywhere</p>
              </div>
              <ToggleSwitch
                checked={offlineMode}
                onChange={() => setOfflineMode((prev) => !prev)}
                label="Toggle offline mode"
              />
            </div>
          </div>
        </section>

        <p className="sp-version">Version 26.08 Build 14776</p>
      </main>
    </div>
  );
}
