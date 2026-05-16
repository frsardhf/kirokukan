import { cleanDescription, plainText } from '@/lib/sanitize'
import { cn } from '@/lib/utils'

interface SynopsisProps {
  description: string | null | undefined
  variant?: 'preview' | 'full'
  className?: string
}

export function Synopsis({ description, variant = 'preview', className }: SynopsisProps) {
  if (!description) {
    return <p className={cn('text-muted-foreground/70 italic text-sm', className)}>No synopsis available.</p>
  }

  if (variant === 'preview') {
    const text = plainText(description)
    return <p className={cn('text-sm leading-snug', className)}>{text}</p>
  }

  const html = cleanDescription(description, { spoilers: 'blur', collapseBreaks: false })
  return (
    <div
      className={cn('text-sm leading-relaxed [&_br]:block', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
