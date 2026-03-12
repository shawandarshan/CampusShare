"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-neutral-900 group-[.toaster]:border-neutral-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-neutral-500",
          actionButton: "group-[.toast]:bg-emerald-600 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-500",
          error: "group toast group-[.toaster]:bg-rose-500 group-[.toaster]:text-white group-[.toaster]:border-rose-600",
          success: "group toast group-[.toaster]:bg-emerald-500 group-[.toaster]:text-white group-[.toaster]:border-emerald-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
