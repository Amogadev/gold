"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SidebarContextValue = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isMobile: boolean
  isCollapsed: boolean
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({
  children,
  defaultCollapsed,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(!isMobile)
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed ?? false)

  const toggle = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev)
    } else {
      setIsCollapsed((prev) => !prev)
      setIsOpen(true)
    }
  }

  React.useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false)
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{ isOpen, setIsOpen, isMobile, isCollapsed, toggle }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "flex-col bg-sidebar text-sidebar-foreground",
  {
    variants: {
      isMobile: {
        true: "hidden",
        false: "flex",
      },
      isCollapsed: {
        true: "w-16 items-center",
        false: "w-64",
      },
    },
    defaultVariants: {
      isMobile: false,
      isCollapsed: false,
    },
  }
)

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { isMobile, isOpen, setIsOpen, isCollapsed } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className={cn("flex flex-col bg-sidebar p-0 text-sidebar-foreground", isMobile ? "w-64" : "hidden")}
        >
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        sidebarVariants({ isMobile, isCollapsed }),
        "border-r transition-all duration-300 ease-in-out",
        className
      )}
    >
      {children}
    </aside>
  )
}

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-16 items-center border-b px-4",
        isCollapsed && "justify-center",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <h1
      ref={ref}
      className={cn(isCollapsed && "hidden", className)}
      {...props}
    />
  )
})
SidebarTitle.displayName = "SidebarTitle"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto border-t p-4", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-y-1", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("relative", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"


export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { isActive?: boolean }
>(({ className, children, isActive, ...props }, ref) => {
  const { isCollapsed } = useSidebar()

  const buttonContent = (
    <Button
      ref={ref}
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "flex w-full items-center justify-start gap-2",
        isCollapsed && "justify-center",
        className
      )}
      {...props}
    >
      {isCollapsed ? (
        <>{React.Children.toArray(children)[0]}</>
      ) : (
        <>{children}</>
      )}
    </Button>
  )
  
  const tooltipContent = React.Children.map(children, child => {
    if (typeof child === 'string') return child;
    return null;
  })?.join(' ');

  return isCollapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
      <TooltipContent side="right">
        <p>{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    buttonContent
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className="flex-1" {...props}>
      {children}
    </div>
  )
})
SidebarInset.displayName = "SidebarInset"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  const { toggle } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="md:hidden"
      {...props}
    >
      <PanelLeft />
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"
