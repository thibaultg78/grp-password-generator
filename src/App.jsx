import { useState } from 'react'
import { useTranslation } from './hooks/useTranslation'
import { useTheme } from './hooks/useTheme'

function App() {
  const { t, language, setLanguage } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [length, setLength] = useState(24) // Password length state (default 24 characters)
  const [count, setCount] = useState(1) // Number of passwords to generate
  const [passwords, setPasswords] = useState([]) // Array of generated passwords
  const [copied, setCopied] = useState(false) // Copy feedback state
  const [options, setOptions] = useState({ // Password composition options
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    avoidAmbiguous: true
  })
  const [excludeChars, setExcludeChars] = useState('') // Characters to exclude from password
  const [excludeEnabled, setExcludeEnabled] = useState(false) // Enable/disable character exclusion

  // Generates one or multiple passwords based on selected options
  const generatePassword = () => {
    let charset = ''
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.numbers) charset += '0123456789'
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (options.avoidAmbiguous) {
      charset = charset.replace(/[ilIL10oO]/g, '')
    }

    if (excludeEnabled && excludeChars) {
      for (const char of excludeChars) {
        charset = charset.split(char).join('')
      }
    }

    if (charset === '') {
      setPasswords([t('selectAtLeastOneOption')])
      return
    }

    const generated = []
    for (let p = 0; p < count; p++) {
      const array = new Uint32Array(length) // Cryptographically secure random array
      crypto.getRandomValues(array)

      let result = ''
      for (let i = 0; i < length; i++) {
        result += charset[array[i] % charset.length]
      }
      generated.push(result)
    }

    setPasswords(generated)
    setCopied(false)
  }

  // Copies a single password to clipboard
  const copyToClipboard = async (text) => {
    if (text && text !== t('selectAtLeastOneOption')) {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Copies all generated passwords to clipboard (separated by line breaks)
  const copyAll = async () => {
    const all = passwords.join('\n') // Join all passwords with newlines
    await navigator.clipboard.writeText(all)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Toggles a specific password composition option
  const handleOptionChange = (option) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }))
  }

  // Calculates password strength based on entropy
  const calculateStrength = () => {
    if (!passwords.length || passwords[0] === t('selectAtLeastOneOption')) return null

    let charsetSize = 0 // Total available characters for password generation
    if (options.lowercase) charsetSize += 26
    if (options.uppercase) charsetSize += 26
    if (options.numbers) charsetSize += 10
    if (options.symbols) charsetSize += 30
    if (options.avoidAmbiguous) charsetSize -= 8

    const entropy = Math.floor(length * Math.log2(charsetSize || 1)) // Password entropy in bits

    if (entropy < 40) return { level: 'weak', label: t('weak'), percent: 25, color: '#ef4444' }
    if (entropy < 60) return { level: 'medium', label: t('medium'), percent: 50, color: '#f59e0b' }
    if (entropy < 80) return { level: 'strong', label: t('strong'), percent: 75, color: '#22c55e' }
    return { level: 'verystrong', label: t('veryStrong'), percent: 100, color: '#16a34a' }
  }

  // Calculates estimated time to crack the password using brute force
  const getTimeToCrack = () => {
    if (!passwords.length) return null

    let charsetSize = 0 // Total available characters for password generation
    if (options.lowercase) charsetSize += 26
    if (options.uppercase) charsetSize += 26
    if (options.numbers) charsetSize += 10
    if (options.symbols) charsetSize += 30
    if (options.avoidAmbiguous) charsetSize -= 8

    const combinations = Math.pow(charsetSize || 1, length) // Total possible combinations
    const guessesPerSecond = 10000000000 // Estimated brute force speed (10 billion guesses/second)
    const seconds = combinations / guessesPerSecond // Time to crack in seconds

    // Helper function to format time with proper plural forms
    const plural = (n, key) => {
      const value = Math.floor(n)
      return `${value} ${t(value > 1 ? key + 'Plural' : key)}`
    }

    if (seconds < 1) return t('instant')
    if (seconds < 60) return plural(seconds, 'second')
    if (seconds < 3600) return plural(seconds / 60, 'minute')
    if (seconds < 86400) return plural(seconds / 3600, 'hour')
    if (seconds < 31536000) return plural(seconds / 86400, 'day')
    if (seconds < 31536000 * 1000) return plural(seconds / 31536000, 'year')
    if (seconds < 31536000 * 1000000) return t('thousandsOfYears')
    return t('millionsOfYears')
  }

  const strength = calculateStrength() // Current password strength assessment
  const timeToCrack = getTimeToCrack() // Estimated time to crack current password

  // Toggles between French and English languages
  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  return (
    <>
      <header className="header">
        <span className="icon">🔐</span>
        <h1>{t('title')}</h1>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
          </button>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* <p className="version">{t('version')}</p> */}

          <div className="description">
            {t('description')}
          </div>

          <div className="section">
            <div className="section-title">{t('numberOfCharacters')}</div>
            <div className="length-display">
              <span>{t('passwordLength')}</span>
              <span className="length-value">{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              step="4"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <div className="range-marks">
              <span>8</span>
              <span>24</span>
              <span>40</span>
              <span>56</span>
              <span>64</span>
            </div>
          </div>

          <div className="section">
            <div className="section-title">{t('passwordComposition')}</div>
            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() => handleOptionChange('lowercase')}
                />
                {t('lowercase')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() => handleOptionChange('uppercase')}
                />
                {t('uppercase')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() => handleOptionChange('numbers')}
                />
                {t('numbers')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() => handleOptionChange('symbols')}
                />
                {t('symbols')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={options.avoidAmbiguous}
                  onChange={() => handleOptionChange('avoidAmbiguous')}
                />
                {t('avoidAmbiguous')}
              </label>
              <label className="exclude-option">
                <input
                  type="checkbox"
                  checked={excludeEnabled}
                  onChange={() => setExcludeEnabled(!excludeEnabled)}
                />
                <span>{t('exclude')}</span>
                <input
                  type="text"
                  className={`exclude-input-inline ${!excludeEnabled ? 'disabled' : ''}`}
                  value={excludeChars}
                  onChange={(e) => setExcludeChars(e.target.value)}
                  placeholder="@#$"
                  disabled={!excludeEnabled}
                />
              </label>
            </div>
          </div>

          <div className="section">
            <div className="section-title">{t('numberOfPasswords')}</div>
            <div className="count-options">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  className={`count-btn ${count === n ? 'active' : ''}`}
                  onClick={() => setCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={generatePassword}>
            {t('generate')}
          </button>

          {passwords.length > 0 && passwords[0] !== t('selectAtLeastOneOption') && (
            <div className="result">
              <div className="passwords-list">
                {passwords.map((pwd, index) => (
                  <div key={index} className="password-item">
                    <code>{pwd}</code>
                    <button
                      className="copy-btn-small"
                      onClick={() => copyToClipboard(pwd)}
                    >
                      {t('copy')}
                    </button>
                  </div>
                ))}
              </div>
              {passwords.length > 1 && (
                <button className={`copy-all-btn ${copied ? 'copied' : ''}`} onClick={copyAll}>
                  {copied ? t('allCopied') : t('copyAll')}
                </button>
              )}
              {strength && (
                <div className="strength-section">
                  <div className="strength-header">
                    <span>{t('security')}</span>
                    <span className="strength-label" style={{ background: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{ width: `${strength.percent}%`, background: strength.color }}
                    ></div>
                  </div>
                  <div className="crack-time">
                    <strong>{timeToCrack}</strong> {t('toCrack')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        {t('footer')} <a href="https://akril.net" target="_blank" rel="noopener noreferrer">akril.net</a>
      </footer>
    </>
  )
}

export default App
