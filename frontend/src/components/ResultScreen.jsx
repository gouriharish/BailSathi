import { useTranslation } from 'react-i18next'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ResultScreen({ result, threshold, onCheckAgain }) {
  const { t } = useTranslation()

  if (!result) return null

  const { eligible, daysRemaining } = result
  const daysElapsed = Math.max(threshold - daysRemaining, 0)
  const progress = eligible ? 1 : Math.min(daysElapsed / threshold, 1)
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const ringColor = eligible ? 'var(--color-success)' : 'var(--color-waiting)'

  return (
    <div className="result-card">
      <span className={`status-banner ${eligible ? 'eligible' : 'waiting'}`}>
        {eligible ? t('result.eligibleTitle') : t('result.notEligibleTitle')}
      </span>

      <svg
        className="result-ring"
        width="140"
        height="140"
        viewBox="0 0 140 140"
        role="img"
        aria-label={eligible ? t('result.eligibleTitle') : t('result.notEligibleBody', { days: daysRemaining })}
      >
        <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="var(--color-border)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="64" textAnchor="middle" fontSize="30" fontWeight="800" fill="var(--color-ink)">
          {eligible ? '✓' : daysRemaining}
        </text>
        {!eligible && (
          <text x="70" y="86" textAnchor="middle" fontSize="12" fill="var(--color-ink-soft)">
            days
          </text>
        )}
      </svg>

      <h2 className={`result-title ${eligible ? 'eligible' : 'waiting'}`}>
        {eligible ? t('result.eligibleTitle') : t('result.notEligibleTitle')}
      </h2>
      <p className="result-body">
        {eligible ? t('result.eligibleBody') : t('result.notEligibleBody', { days: daysRemaining })}
      </p>

      <div className="result-actions">
        {eligible && (
          <>
            {/* Stubs for Person 3's work — wire these up once jsPDF + DLSA data land */}
            <button type="button" className="btn btn-primary" onClick={() => alert('TODO: jsPDF generation')}>
              {t('result.downloadPdf')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => alert('TODO: DLSA map link')}>
              {t('result.findDlsa')}
            </button>
          </>
        )}
        {!eligible && (
          <button type="button" className="btn btn-secondary" onClick={() => alert('TODO: DLSA map link')}>
            {t('result.findDlsa')}
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={onCheckAgain}>
          {t('result.checkAgain')}
        </button>
      </div>
    </div>
  )
}
