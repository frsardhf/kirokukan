import type {
  FuzzyDate,
  Media,
  MediaListEntry,
  MediaListStatus,
} from '@/lib/anilist/types'
import { dateToFuzzy, fuzzyDateToDate } from '@/lib/media'

// TODO(settings): make default status configurable.
export const DEFAULT_NEW_STATUS: MediaListStatus = 'CURRENT'

export interface FormState {
  status: MediaListStatus
  progress: string
  progressVolumes: string
  startedAt: Date | null
  completedAt: Date | null
}

export interface FormWarning {
  message: string
  action?: { label: string; status: MediaListStatus }
}

export function nullFuzzy(): FuzzyDate {
  return { year: null, month: null, day: null }
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function draftEntry(media: Media): MediaListEntry {
  return {
    id: 0,
    mediaId: media.id,
    status: DEFAULT_NEW_STATUS,
    progress: 0,
    progressVolumes: 0,
    startedAt: nullFuzzy(),
    completedAt: nullFuzzy(),
    updatedAt: 0,
    createdAt: 0,
    media,
  }
}

export function toFormState(entry: MediaListEntry): FormState {
  return {
    status: entry.status,
    progress: entry.progress > 0 ? String(entry.progress) : '',
    progressVolumes: entry.progressVolumes > 0 ? String(entry.progressVolumes) : '',
    startedAt: fuzzyDateToDate(entry.startedAt),
    completedAt: fuzzyDateToDate(entry.completedAt),
  }
}

export function parseProgress(value: string, max: number | null | undefined): number {
  const num = value.trim() === '' ? 0 : Math.max(0, parseInt(value, 10) || 0)
  return max != null ? Math.min(num, max) : num
}

export function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a && !b) return true
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function applyStatusAutofill(prev: FormState, nextStatus: MediaListStatus, media: Media): FormState {
  const today = startOfToday()
  if (nextStatus === 'CURRENT') {
    return {
      ...prev,
      status: nextStatus,
      startedAt: prev.startedAt ?? today,
    }
  }
  if (nextStatus === 'COMPLETED') {
    const isManga = media.type === 'MANGA'
    const max = isManga ? media.chapters : media.episodes
    const progressNum = prev.progress.trim() === '' ? 0 : parseInt(prev.progress, 10) || 0
    const nextProgress = max != null && progressNum < max ? String(max) : prev.progress
    return {
      ...prev,
      status: nextStatus,
      progress: nextProgress,
      completedAt: prev.completedAt ?? today,
    }
  }
  return { ...prev, status: nextStatus }
}

export function buildPatch(entry: MediaListEntry, form: FormState) {
  const isManga = entry.media.type === 'MANGA'
  const progressMax = isManga ? entry.media.chapters : entry.media.episodes
  const volumesMax = entry.media.volumes
  return {
    entry,
    status: form.status,
    progress: parseProgress(form.progress, progressMax),
    progressVolumes: isManga ? parseProgress(form.progressVolumes, volumesMax) : 0,
    startedAt: form.startedAt ? dateToFuzzy(form.startedAt) : nullFuzzy(),
    completedAt: form.completedAt ? dateToFuzzy(form.completedAt) : nullFuzzy(),
  }
}

export function isFormDirty(form: FormState, entry: MediaListEntry): boolean {
  const isManga = entry.media.type === 'MANGA'
  const progressMax = isManga ? entry.media.chapters : entry.media.episodes
  const volumesMax = entry.media.volumes
  if (form.status !== entry.status) return true
  if (parseProgress(form.progress, progressMax) !== entry.progress) return true
  if (isManga && parseProgress(form.progressVolumes, volumesMax) !== entry.progressVolumes) {
    return true
  }
  if (!sameDay(form.startedAt, fuzzyDateToDate(entry.startedAt))) return true
  if (!sameDay(form.completedAt, fuzzyDateToDate(entry.completedAt))) return true
  return false
}

export function getFormWarnings(form: FormState, entry: MediaListEntry): FormWarning[] {
  const warnings: FormWarning[] = []
  const isManga = entry.media.type === 'MANGA'
  const total = isManga ? entry.media.chapters : entry.media.episodes
  const lengthLabel = isManga ? 'chapters' : 'episodes'
  const releaseTerm = isManga ? 'released' : 'aired'
  const progressNum = form.progress.trim() === '' ? 0 : parseInt(form.progress, 10) || 0
  const today = startOfToday()
  const airStart = fuzzyDateToDate(entry.media.startDate)

  if (form.startedAt && form.completedAt && form.completedAt < form.startedAt) {
    warnings.push({ message: 'Finish date is earlier than the start date.' })
  }
  if (form.startedAt && form.startedAt > today) {
    warnings.push({ message: 'Start date is in the future.' })
  }
  if (form.completedAt && form.completedAt > today) {
    warnings.push({ message: 'Finish date is in the future.' })
  }
  if (airStart && form.startedAt && form.startedAt < airStart) {
    warnings.push({ message: `Start date is before the series first ${releaseTerm}.` })
  }
  if (airStart && form.completedAt && form.completedAt < airStart) {
    warnings.push({ message: `Finish date is before the series first ${releaseTerm}.` })
  }
  if (form.status === 'PLANNING' && (form.startedAt || form.completedAt)) {
    warnings.push({ message: 'Planning entry has a start or finish date set.' })
  }
  if (form.status === 'CURRENT' && form.completedAt) {
    warnings.push({
      message: 'Watching entry has a finish date set.',
      action: { label: 'Mark Completed', status: 'COMPLETED' },
    })
  }
  if (form.status === 'COMPLETED' && total != null && progressNum < total) {
    warnings.push({
      message: `Completed but only ${progressNum} of ${total} ${lengthLabel} marked.`,
    })
  }
  if (form.status === 'CURRENT' && total != null && progressNum >= total) {
    warnings.push({
      message: `All ${total} ${lengthLabel} watched.`,
      action: { label: 'Mark Completed', status: 'COMPLETED' },
    })
  }

  return warnings
}
