import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिं' },
  { code: 'ml', label: 'മല' }
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="lang-switcher" role="group" aria-label="Choose language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className="lang-btn"
          aria-pressed={i18n.resolvedLanguage === lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
