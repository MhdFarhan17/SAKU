import * as React from "react"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/money"

export interface AmountChipProps extends React.HTMLAttributes<HTMLDivElement> {
  amountMinor: number
  kind?: 'income' | 'expense' | 'transfer' | 'neutral'
  showSign?: boolean
}

const AmountChip = React.forwardRef<HTMLDivElement, AmountChipProps>(
  ({ className, amountMinor, kind = 'neutral', showSign = true, ...props }, ref) => {
    
    // Determine sign string if needed
    let signStr = ''
    if (showSign) {
      if (kind === 'income' && amountMinor > 0) signStr = '+'
      if (kind === 'expense' && amountMinor > 0) signStr = '-'
    }
    
    // Format money (taking absolute value just in case)
    const formatted = formatMoney(Math.abs(amountMinor))

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center font-mono text-sm",
          kind === 'income' && "text-income",
          kind === 'expense' && "text-expense",
          kind === 'transfer' && "text-text-secondary",
          kind === 'neutral' && "text-text-main",
          className
        )}
        {...props}
      >
        {signStr}{formatted}
      </div>
    )
  }
)
AmountChip.displayName = "AmountChip"

export { AmountChip }
