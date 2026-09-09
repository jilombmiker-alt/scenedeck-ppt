import assert from 'node:assert/strict'
import test from 'node:test'
import { validatePlan } from './validate_plan.mjs'

const validPlan = {
  title: 'SceneDeck product proposal',
  mode: 'professional',
  scenario: 'product',
  brief: {
    speaker: 'Product manager',
    audience: 'Business owner',
    job: 'Obtain approval for a controlled validation',
    expectedAction: 'Approve the scope and owner',
    durationMinutes: 12,
  },
  slides: [
    { id: 's01', layout: 'cover', title: 'The opportunity is ready to test', claim: 'The problem is material enough to validate now', bullets: [], evidenceStatus: 'judgment', speakerNote: 'Open with the decision.', sources: [] },
    { id: 's02', layout: 'statement', title: 'Evidence is still incomplete', claim: '[待补充：three recent user interviews]', bullets: ['Do not invent evidence'], evidenceStatus: 'needed', speakerNote: 'Name the gap.', sources: [] },
    { id: 's03', layout: 'closing', title: 'Approve a controlled next step', claim: 'A two-week test will answer the riskiest question', bullets: ['Confirm scope', 'Confirm owner'], evidenceStatus: 'judgment', speakerNote: 'Ask for a decision.', sources: [] },
  ],
}

test('accepts a complete evidence-aware plan', () => {
  assert.deepEqual(validatePlan(validPlan).errors, [])
})

test('rejects duplicate ids and unresolved needed evidence', () => {
  const invalid = structuredClone(validPlan)
  invalid.slides[1].id = 's01'
  invalid.slides[1].claim = 'Evidence is missing'
  const { errors } = validatePlan(invalid)
  assert.ok(errors.some((error) => error.includes('duplicate')))
  assert.ok(errors.some((error) => error.includes('no [待补充：...] marker')))
})
