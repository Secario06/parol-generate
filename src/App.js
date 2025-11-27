import React, { useState, useCallback } from 'react'
import './App.css'

function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [settings, setSettings] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  })

  const generatePassword = useCallback(() => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'
    const symbolChars = '!@#$%^&*'

    let charSet = ''
    if (settings.uppercase) charSet += uppercaseChars
    if (settings.lowercase) charSet += lowercaseChars
    if (settings.numbers) charSet += numberChars
    if (settings.symbols) charSet += symbolChars

    if (charSet === '') {
      alert('Выберите хотя бы один тип символов!')
      return
    }

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length)
      newPassword += charSet[randomIndex]
    }

    setPassword(newPassword)
  }, [length, settings])

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password)
      alert('Пароль скопирован в буфер обмена!')
    }
  }

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const calculateStrength = () => {
    if (!password) return 0

    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    if (password.length >= 16) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1

    return Math.min(strength, 6)
  }

  const getStrengthColor = () => {
    const strength = calculateStrength()
    if (strength <= 2) return '#ff4757'
    if (strength <= 4) return '#ffa502'
    return '#2ed573'
  }

  const getStrengthText = () => {
    const strength = calculateStrength()
    if (strength <= 2) return 'Слабый'
    if (strength <= 4) return 'Средний'
    return 'Сильный'
  }

  return (
    <div className="container">
      <h1>🔐 Генератор паролей</h1>

      <div className="password-display">
        <div className="password-output" onClick={copyToClipboard}>
          {password || 'Нажмите "Сгенерировать"'}
        </div>
        {password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{
                  width: `${(calculateStrength() / 6) * 100}%`,
                  backgroundColor: getStrengthColor()
                }}
              ></div>
            </div>
            <span style={{ color: getStrengthColor() }}>
              {getStrengthText()}
            </span>
          </div>
        )}
      </div>

      <div className="settings">
        <div className="setting-group">
          <label>
            Длина пароля: <span className="length-value">{length}</span>
          </label>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="length-slider"
          />
        </div>

        <div className="setting-group">
          <label>Типы символов:</label>
          <div className="checkbox-grid">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="uppercase"
                checked={settings.uppercase}
                onChange={() => toggleSetting('uppercase')}
              />
              <label htmlFor="uppercase">A-Z</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="lowercase"
                checked={settings.lowercase}
                onChange={() => toggleSetting('lowercase')}
              />
              <label htmlFor="lowercase">a-z</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="numbers"
                checked={settings.numbers}
                onChange={() => toggleSetting('numbers')}
              />
              <label htmlFor="numbers">0-9</label>
            </div>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="symbols"
                checked={settings.symbols}
                onChange={() => toggleSetting('symbols')}
              />
              <label htmlFor="symbols">!@#$%^&*</label>
            </div>
          </div>
        </div>
      </div>

      <button onClick={generatePassword} className="generate-btn">
        🎲 Сгенерировать пароль
      </button>

      <button onClick={copyToClipboard} className="copy-btn" disabled={!password}>
        📋 Копировать
      </button>
    </div>
  )
}

export default PasswordGenerator
