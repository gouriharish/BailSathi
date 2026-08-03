/**
 * Eligibility engine for default/statutory bail under BNSS Section 187.
 *
 * This is a PURE function on purpose: same inputs always produce the same
 * output, no database, no network, no Date.now() unless the caller lets it
 * default. That's what makes it independently reviewable by a mentor or
 * lawyer without touching the rest of the codebase, and trivially testable.
 *
 * IMPORTANT — confirm with your mentor/lawyer contact before the demo:
 * the offence-severity threshold used here (offenceType 'minor' -> 60 days,
 * 'major' -> 90 days) is a simplification for the hackathon. The actual
 * statutory line depends on specific sentence lengths (e.g. offences
 * punishable by death/life imprisonment/10+ years vs. others) — if you have
 * time, replace the two-bucket offenceType with the real threshold logic.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24

const THRESHOLDS = {
  minor: 60,
  major: 90
}

function checkEligibility({ offenceType, arrestDate, chargesheetFiled, today }) {
  validateInput({ offenceType, arrestDate, chargesheetFiled })

  const threshold = THRESHOLDS[offenceType]
  const arrest = startOfDay(new Date(arrestDate))
  const now = startOfDay(today ? new Date(today) : new Date())
  const daysInCustody = Math.round((now - arrest) / MS_PER_DAY)

  if (chargesheetFiled) {
    return {
      eligible: false,
      daysRemaining: 0,
      daysInCustody,
      reason: 'chargesheet_filed'
    }
  }

  if (daysInCustody >= threshold) {
    return {
      eligible: true,
      daysRemaining: 0,
      daysInCustody,
      reason: 'default_bail_threshold_crossed'
    }
  }

  return {
    eligible: false,
    daysRemaining: threshold - daysInCustody,
    daysInCustody,
    reason: 'threshold_not_yet_crossed'
  }
}

function validateInput({ offenceType, arrestDate, chargesheetFiled }) {
  if (!Object.keys(THRESHOLDS).includes(offenceType)) {
    throw new EligibilityInputError(
      `offenceType must be one of: ${Object.keys(THRESHOLDS).join(', ')}`
    )
  }

  const parsedArrestDate = new Date(arrestDate)
  if (Number.isNaN(parsedArrestDate.getTime())) {
    throw new EligibilityInputError('arrestDate must be a valid date string')
  }

  if (parsedArrestDate.getTime() > Date.now()) {
    throw new EligibilityInputError('arrestDate cannot be in the future')
  }

  if (typeof chargesheetFiled !== 'boolean') {
    throw new EligibilityInputError('chargesheetFiled must be a boolean')
  }
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

class EligibilityInputError extends Error {
  constructor(message) {
    super(message)
    this.name = 'EligibilityInputError'
  }
}

module.exports = { checkEligibility, EligibilityInputError, THRESHOLDS }