#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const MODES = new Set(['quick', 'professional', 'creative'])
const SCENARIOS = new Set(['product', 'review', 'sales', 'fundraising', 'teaching', 'general'])
const LAYOUTS = new Set(['cover', 'statement', 'split', 'metrics', 'timeline', 'visual', 'closing'])
const EVIDENCE = new Set(['provided', 'judgment', 'needed'])

const isText = (value) => typeof value === 'string' && value.trim().length > 0
const textLength = (value) => Array.from(value || '').length

export function validatePlan(plan) {
  const errors = []
  const warnings = []

  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return { errors: ['Plan must be a JSON object.'], warnings }
  if (!isText(plan.title)) errors.push('title must be a non-empty string.')
  if (!MODES.has(plan.mode)) errors.push(`mode must be one of: ${[...MODES].join(', ')}.`)
  if (!SCENARIOS.has(plan.scenario)) errors.push(`scenario must be one of: ${[...SCENARIOS].join(', ')}.`)

  const brief = plan.brief
  if (!brief || typeof brief !== 'object') {
    errors.push('brief must be an object.')
  } else {
    for (const field of ['speaker', 'audience', 'job', 'expectedAction']) {
      if (!isText(brief[field])) errors.push(`brief.${field} must be a non-empty string.`)
    }
    if (!Number.isFinite(brief.durationMinutes) || brief.durationMinutes <= 0) errors.push('brief.durationMinutes must be a positive number.')
  }

  if (!Array.isArray(plan.slides) || plan.slides.length < 3 || plan.slides.length > 20) {
    errors.push('slides must contain 3 to 20 slide objects.')
    return { errors, warnings }
  }

  const ids = new Set()
  plan.slides.forEach((slide, index) => {
    const at = `slides[${index}]`
    if (!slide || typeof slide !== 'object' || Array.isArray(slide)) {
      errors.push(`${at} must be an object.`)
      return
    }
    if (!isText(slide.id)) errors.push(`${at}.id must be a non-empty string.`)
    else if (ids.has(slide.id)) errors.push(`${at}.id must be unique; duplicate "${slide.id}".`)
    else ids.add(slide.id)
    if (!LAYOUTS.has(slide.layout)) errors.push(`${at}.layout is invalid.`)
    if (!isText(slide.title)) errors.push(`${at}.title must be a non-empty string.`)
    if (!isText(slide.claim)) errors.push(`${at}.claim must be a non-empty string.`)
    if (!Array.isArray(slide.bullets) || slide.bullets.length > 5 || slide.bullets.some((item) => !isText(item))) errors.push(`${at}.bullets must be an array of 0 to 5 non-empty strings.`)
    if (!EVIDENCE.has(slide.evidenceStatus)) errors.push(`${at}.evidenceStatus is invalid.`)
    if (!isText(slide.speakerNote)) warnings.push(`${at}.speakerNote is empty.`)
    if (!Array.isArray(slide.sources)) errors.push(`${at}.sources must be an array.`)
    else slide.sources.forEach((source, sourceIndex) => {
      if (!source || !isText(source.label) || !isText(source.url)) errors.push(`${at}.sources[${sourceIndex}] needs non-empty label and url.`)
    })

    const combined = [slide.title, slide.claim, ...(Array.isArray(slide.bullets) ? slide.bullets : []), slide.speakerNote].join(' ')
    if (slide.evidenceStatus === 'needed' && !combined.includes('[待补充：')) errors.push(`${at} is marked needed but has no [待补充：...] marker.`)
    if (textLength(slide.title) > 34) warnings.push(`${at}.title may be too long (${textLength(slide.title)} characters).`)
    if (textLength(slide.claim) > 70) warnings.push(`${at}.claim may be too long (${textLength(slide.claim)} characters).`)
    if (slide.bullets?.some((item) => textLength(item) > 58)) warnings.push(`${at} has a bullet longer than 58 characters.`)
  })

  if (plan.slides[0]?.layout !== 'cover') warnings.push('The first slide is normally expected to use layout "cover".')
  if (plan.slides.at(-1)?.layout !== 'closing') warnings.push('The final slide is normally expected to use layout "closing".')
  if (!plan.slides.some((slide) => slide.evidenceStatus === 'needed') && plan.slides.every((slide) => slide.sources?.length === 0)) warnings.push('No sources or evidence gaps are visible; recheck whether claims are actually supported.')

  return { errors, warnings }
}

async function main() {
  const inputPath = process.argv[2]
  if (!inputPath) {
    console.error('Usage: node scripts/validate_plan.mjs /absolute/path/to/plan.json')
    process.exitCode = 2
    return
  }

  try {
    const plan = JSON.parse(await readFile(inputPath, 'utf8'))
    const result = validatePlan(plan)
    for (const warning of result.warnings) console.warn(`WARN: ${warning}`)
    for (const error of result.errors) console.error(`ERROR: ${error}`)
    if (result.errors.length) {
      console.error(`Validation failed with ${result.errors.length} error(s) and ${result.warnings.length} warning(s).`)
      process.exitCode = 1
      return
    }
    console.log(`Validation passed: ${plan.slides.length} slides, ${result.warnings.length} warning(s).`)
  } catch (error) {
    console.error(`ERROR: ${error.message}`)
    process.exitCode = 1
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main()
