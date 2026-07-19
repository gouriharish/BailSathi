import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'
import QuestionFlow from './components/QuestionFlow'
import ResultScreen from './components/ResultScreen'
import { checkEligibility } from './api/client'

// view: 'form' -> 'loading' -> 'result' | 'error'
export default function App() {
  const { t } = useTranslation()
  const [view, setView] = useState('form')
  const [result, setResult] = useState(null)
  const [threshold, setThreshold] = useState(60)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleComplete(answers) {
    setView('loading')
    setThreshold(answers.offenceType === 'major' ? 90 : 60)
    try {
      const data = await checkEligibility(answers)
      setResult(data)
      setView('result')
    } catch (err) {
      setErrorMsg(err.message)
      setView('error')
    }
  }

  function reset() {
    setResult(null)
    setView('form')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-title">{t('appTitle')}</p>
          <p className="app-subtitle">{t('appSubtitle')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      {view === 'form' && <QuestionFlow onComplete={handleComplete} />}

      {view === 'loading' && (
        <div className="question-card" role="status" aria-live="polite">
          <p className="question-label">{t('checking')}</p>
        </div>
      )}

      {view === 'result' && (
        <ResultScreen result={result} threshold={threshold} onCheckAgain={reset} />
      )}

      {view === 'error' && (
        <div className="question-card">
          <p className="error-text">{t('result.error')}</p>
          <div className="nav-row">
            <button type="button" className="btn btn-primary" onClick={reset}>
              {t('result.checkAgain')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
