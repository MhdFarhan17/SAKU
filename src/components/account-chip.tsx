import * as React from "react"
import { cn } from "@/lib/utils"
import { Wallet, CreditCard, Building2, Smartphone } from "lucide-react"

export interface AccountChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  name: string
  type: 'cash' | 'bank' | 'card' | 'ewallet'
  color?: string | null
}

export function getAccountIcon(type: string, className?: string) {
  switch (type) {
    case 'cash': return <Wallet className={cn("w-4 h-4", className)} />
    case 'bank': return <Building2 className={cn("w-4 h-4", className)} />
    case 'card': return <CreditCard className={cn("w-4 h-4", className)} />
    case 'ewallet': return <Smartphone className={cn("w-4 h-4", className)} />
    default: return <Wallet className={cn("w-4 h-4", className)} />
  }
}

const AccountChip = React.forwardRef<HTMLDivElement, AccountChipProps>(
  ({ className, name, type, color, ...props }, ref) => {
    
    // In a real app we'd map `color` (e.g. 'blue', 'green') to Tailwind background colors,
    // but for now we'll just use a subtle generic background or inline style if valid CSS color.
    const customStyle = color && color.startsWith('#') ? { backgroundColor: `${color}1A`, color: color } : {}
    
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-surface-subtle text-text-secondary border border-border",
          className
        )}
        style={customStyle}
        {...props}
      >
        {getAccountIcon(type, "w-3 h-3")}
        {name}
      </div>
    )
  }
)
AccountChip.displayName = "AccountChip"

export { AccountChip }
