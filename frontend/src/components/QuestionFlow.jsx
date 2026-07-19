import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const STEPS = ['offenceType', 'arrestDate', 'chargesheetFiled', 'district']

export default function QuestionFlow({ onComplete }) {
  const { t } = useTranslation()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({
    offenceType: null,
    arrestDate: '',
    chargesheetFiled: null, // boolean
    district: ''
  })

  const step = STEPS[stepIndex]
  const isLastStep = stepIndex === STEPS.length - 1
  const isAnswered = isStepAnswered(step, answers)

  function update(field, value) {
    setAnswers((prev) => ({ ...prev, [field]: value }))
  }

  function goNext() {
    if (isLastStep) {
      onComplete(answers)
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <p className="progress-label">
        {t('step', { current: stepIndex + 1, total: STEPS.length })}
      </p>

      <div className="question-card">
        {step === 'offenceType' && (
          <>
            <h2 className="question-label">{t('questions.offenceType.label')}</h2>
            <div className="option-grid" role="radiogroup">
              <OptionCard
                icon="📄"
                label={t('questions.offenceType.minor')}
                selected={answers.offenceType === 'minor'}
                onClick={() => update('offenceType', 'minor')}
              />
              <OptionCard
                icon="⚠️"
                label={t('questions.offenceType.major')}
                selected={answers.offenceType === 'major'}
                onClick={() => update('offenceType', 'major')}
              />
            </div>
          </>
        )}

        {step === 'arrestDate' && (
          <>
            <h2 className="question-label">{t('questions.arrestDate.label')}</h2>
            <p className="input-hint">{t('questions.arrestDate.hint')}</p>
            <input
              type="date"
              className="text-input"
              value={answers.arrestDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => update('arrestDate', e.target.value)}
            />
          </>
        )}

        {step === 'chargesheetFiled' && (
          <>
            <h2 className="question-label">{t('questions.chargesheetFiled.label')}</h2>
            <div className="option-grid" role="radiogroup">
              <OptionCard
                icon="✅"
                label={t('questions.chargesheetFiled.yes')}
                selected={answers.chargesheetFiled === true}
                onClick={() => update('chargesheetFiled', true)}
              />
              <OptionCard
                icon="⏳"
                label={t('questions.chargesheetFiled.no')}
                selected={answers.chargesheetFiled === false}
                onClick={() => update('chargesheetFiled', false)}
              />
            </div>
          </>
        )}

        {step === 'district' && (
          <>
            <h2 className="question-label">{t('questions.district.label')}</h2>
            {/* TODO: swap for a <select> once Person 3's DLSA directory data lands */}
            <input
              type="text"
              className="text-input"
              value={answers.district}
              onChange={(e) => update('district', e.target.value)}
              autoFocus
            />
          </>
        )}

        <div className="nav-row">
          {stepIndex > 0 && (
            <button type="button" className="btn btn-secondary" onClick={goBack}>
              {t('back')}
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            disabled={!isAnswered}
            onClick={goNext}
          >
            {isLastStep ? t('submit') : t('next')}
          </button>
        </div>
      </div>
    </>
  )
}

function OptionCard({ icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      className="option-card"
      role="radio"
      aria-checked={selected}
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="option-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function isStepAnswered(step, answers) {
  switch (step) {
    case 'offenceType':
      return answers.offenceType !== null
    case 'arrestDate':
      return Boolean(answers.arrestDate)
    case 'chargesheetFiled':
      return answers.chargesheetFiled !== null
    case 'district':
      return answers.district.trim().length > 0
    default:
      return false
  }
}
