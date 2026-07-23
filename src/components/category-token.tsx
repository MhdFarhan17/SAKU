import * as React from "react"
import { cn, normalizeIcon } from "@/lib/utils"
import { Tag } from "lucide-react"

export interface CategoryTokenProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  kind: 'income' | 'expense'
  icon?: string | null
}

const CategoryToken = React.forwardRef<HTMLDivElement, CategoryTokenProps>(
  ({ className, name, kind, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
          kind === 'income' ? "bg-income-bg text-income" : "bg-expense-bg text-expense",
          className
        )}
        {...props}
      >
        {icon ? (
          <span className="text-[14px] leading-none">{normalizeIcon(icon)}</span>
        ) : (
          <Tag className="w-3 h-3" />
        )}
        {name}
      </div>
    )
  }
)
CategoryToken.displayName = "CategoryToken"

export { CategoryToken }
