// Talks to Person 1's Express endpoint: POST /api/check-eligibility
// Confirm this request/response shape against server.js before integrating for real —
// this is written from the API contract described in planning, not from the live code.

const USE_MOCK = false // flip to true to develop without the backend running

export async function checkEligibility({ offenceType, arrestDate, chargesheetFiled, district }) {
  if (USE_MOCK) {
    return mockCheckEligibility({ offenceType, arrestDate, chargesheetFiled, district })
  }

  const res = await fetch('/api/check-eligibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offenceType, arrestDate, chargesheetFiled, district })
  })

  if (!res.ok) {
    throw new Error(`Eligibility check failed: ${res.status}`)
  }

  return res.json() // expected: { eligible, daysRemaining, reason }
}

// Lets you build and test the whole UI before the backend is wired up.
function mockCheckEligibility({ offenceType, arrestDate, chargesheetFiled }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const threshold = offenceType === 'major' ? 90 : 60
      const daysSinceArrest = Math.floor(
        (Date.now() - new Date(arrestDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      const eligible = !chargesheetFiled && daysSinceArrest >= threshold
      resolve({
        eligible,
        daysRemaining: Math.max(threshold - daysSinceArrest, 0),
        reason: eligible
          ? 'default_bail_threshold_crossed'
          : 'threshold_not_yet_crossed'
      })
    }, 500)
  })
}
