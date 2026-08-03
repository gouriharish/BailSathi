const { test } = require('node:test')
const assert = require('node:assert/strict')
const { checkEligibility, EligibilityInputError } = require('../src/eligibility')

const TODAY = new Date('2026-08-03T00:00:00Z')

function daysAgo(n) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

test('minor offence, chargesheet not filed, well past 60 days -> eligible', () => {
  const result = checkEligibility({
    offenceType: 'minor',
    arrestDate: daysAgo(75),
    chargesheetFiled: false,
    today: TODAY
  })
  assert.equal(result.eligible, true)
  assert.equal(result.reason, 'default_bail_threshold_crossed')
})

test('minor offence, well within 60 days -> not eligible, correct days remaining', () => {
  const result = checkEligibility({
    offenceType: 'minor',
    arrestDate: daysAgo(20),
    chargesheetFiled: false,
    today: TODAY
  })
  assert.equal(result.eligible, false)
  assert.equal(result.daysRemaining, 40)
})

test('boundary: exactly on threshold day counts as eligible', () => {
  const result = checkEligibility({
    offenceType: 'minor',
    arrestDate: daysAgo(60),
    chargesheetFiled: false,
    today: TODAY
  })
  assert.equal(result.eligible, true)
})

test('boundary: one day before threshold is not yet eligible', () => {
  const result = checkEligibility({
    offenceType: 'minor',
    arrestDate: daysAgo(59),
    chargesheetFiled: false,
    today: TODAY
  })
  assert.equal(result.eligible, false)
  assert.equal(result.daysRemaining, 1)
})

test('major offence uses 90-day threshold instead of 60', () => {
  const notYet = checkEligibility({
    offenceType: 'major',
    arrestDate: daysAgo(75),
    chargesheetFiled: false,
    today: TODAY
  })
  assert.equal(notYet.eligible, false)
  assert.equal(notYet.daysRemaining, 15)

  const eligible = checkEligibility({
    offenceType: 'major',
    arrestDate: daysAgo(90),
    chargesheetFiled: false,
    today: TODAY
  })
  assert.equal(eligible.eligible, true)
})

test('chargesheet filed even after threshold day closes default bail', () => {
  // This is the edge case judges are most likely to probe: chargesheet
  // filed *late*, but filed nonetheless, right before/after the deadline.
  const result = checkEligibility({
    offenceType: 'minor',
    arrestDate: daysAgo(65),
    chargesheetFiled: true,
    today: TODAY
  })
  assert.equal(result.eligible, false)
  assert.equal(result.reason, 'chargesheet_filed')
})

test('chargesheet filed 1 day before deadline, still closes the door', () => {
  const result = checkEligibility({
    offenceType: 'minor',
    arrestDate: daysAgo(59),
    chargesheetFiled: true,
    today: TODAY
  })
  assert.equal(result.eligible, false)
  assert.equal(result.reason, 'chargesheet_filed')
})

test('invalid offenceType throws a descriptive error', () => {
  assert.throws(
    () =>
      checkEligibility({
        offenceType: 'severe', // not a real bucket
        arrestDate: daysAgo(10),
        chargesheetFiled: false,
        today: TODAY
      }),
    EligibilityInputError
  )
})

test('invalid arrestDate throws', () => {
  assert.throws(
    () =>
      checkEligibility({
        offenceType: 'minor',
        arrestDate: 'not-a-date',
        chargesheetFiled: false,
        today: TODAY
      }),
    EligibilityInputError
  )
})

test('future arrestDate throws', () => {
  assert.throws(
    () =>
      checkEligibility({
        offenceType: 'minor',
        arrestDate: '2099-01-01',
        chargesheetFiled: false,
        today: TODAY
      }),
    EligibilityInputError
  )
})

test('non-boolean chargesheetFiled throws', () => {
  assert.throws(
    () =>
      checkEligibility({
        offenceType: 'minor',
        arrestDate: daysAgo(10),
        chargesheetFiled: 'yes', // string, not boolean — common bug from form data
        today: TODAY
      }),
    EligibilityInputError
  )
})

test('arrested today (0 days in custody) is never eligible', () => {
  const result = checkEligibility({
    offenceType: 'minor',
    arrestDate: daysAgo(0),
    chargesheetFiled: false,
    today: TODAY
  })
  assert.equal(result.eligible, false)
  assert.equal(result.daysRemaining, 60)
})
