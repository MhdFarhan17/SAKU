"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-text-main group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-[16px] group-[.toaster]:font-sans group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:gap-3",
          description: "group-[.toast]:text-text-muted group-[.toast]:font-medium",
          actionButton:
            "group-[.toast]:bg-text-main group-[.toast]:text-surface group-[.toast]:rounded-[10px] group-[.toast]:font-bold group-[.toast]:px-4 group-[.toast]:py-2",
          cancelButton:
            "group-[.toast]:bg-surface-subtle group-[.toast]:text-text-secondary group-[.toast]:rounded-[10px] group-[.toast]:font-bold",
          // Custom color states
          success: "group-[.toaster]:bg-income/10 group-[.toaster]:text-income group-[.toaster]:border-income/20 [&_svg]:text-income group-[.toaster]:shadow-[0_4px_12px_rgba(34,197,94,0.15)]",
          error: "group-[.toaster]:bg-expense/10 group-[.toaster]:text-expense group-[.toaster]:border-expense/20 [&_svg]:text-expense group-[.toaster]:shadow-[0_4px_12px_rgba(239,68,68,0.15)]",
          info: "group-[.toaster]:bg-blue-500/10 group-[.toaster]:text-blue-500 group-[.toaster]:border-blue-500/20 [&_svg]:text-blue-500 group-[.toaster]:shadow-[0_4px_12px_rgba(59,130,246,0.15)]",
          warning: "group-[.toaster]:bg-amber-500/10 group-[.toaster]:text-amber-500 group-[.toaster]:border-amber-500/20 [&_svg]:text-amber-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
