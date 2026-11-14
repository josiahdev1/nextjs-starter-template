'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyCommandProps {
  command: string
  label?: string
}

export function CopyCommand({ command, label }: CopyCommandProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback if clipboard API is blocked
      setCopied(false)
    }
  }, [command])

  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      onClick={handleCopy}
      aria-label={label ? `Copy ${label} command` : `Copy ${command}`}
      className="text-muted-foreground hover:text-foreground shrink-0 gap-1 whitespace-nowrap"
    >
      {copied ? (
        <>
          <Check className="size-3 text-emerald-500" />
          <span className="text-emerald-500">Copied</span>
        </>
      ) : (
        <>
          <Copy className="size-3" />
          <span>Copy</span>
        </>
      )}
    </Button>
  )
}
