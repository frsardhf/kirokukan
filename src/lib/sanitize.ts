import DOMPurify from 'dompurify'

const ALLOWED_TAGS = ['br', 'b', 'strong', 'i', 'em', 'p', 'span']

function stripSpoilers(html: string, mode: 'strip' | 'blur'): string {
  const re = /~!([\s\S]*?)!~/g
  if (mode === 'strip') return html.replace(re, '')
  return html.replace(
    re,
    (_, inner) =>
      `<span class="bg-muted text-muted-foreground/60 rounded px-1 select-none">spoiler</span>${inner ? '' : ''}`,
  )
}

function collapseBreaks(html: string): string {
  return html.replace(/<br\s*\/?\s*>/gi, ' ')
}

export interface CleanOptions {
  spoilers?: 'strip' | 'blur'
  collapseBreaks?: boolean
}

export function cleanDescription(input: string | null | undefined, opts: CleanOptions = {}): string {
  if (!input) return ''
  const spoilerMode = opts.spoilers ?? 'strip'
  let html = stripSpoilers(input, spoilerMode)
  if (opts.collapseBreaks) html = collapseBreaks(html)
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [],
  })
}

export function plainText(input: string | null | undefined): string {
  const cleaned = cleanDescription(input, { spoilers: 'strip', collapseBreaks: true })
  const doc = new DOMParser().parseFromString(cleaned, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}
