'use client'

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function Progress({
  value,
  max = 100,
  className,
  showLabel = false,
  variant = 'gold',
  size = 'md',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variants = {
    default: 'bg-gray-500',
    gold: 'bg-gradient-to-r from-gold-400 to-gold-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  }

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-gold-100 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}
