"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Close sidebar when route changes
    useEffect(() => {
        setOpen(false)
    }, [pathname, searchParams])

    if (open) {
        return (
            <div className="fixed inset-0 z-50 flex md:hidden">
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
                <div className="relative flex w-full max-w-xs flex-1 flex-col bg-background pt-5 pb-4">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <Button
                            variant="ghost"
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <X className="h-6 w-6 text-white" aria-hidden="true" />
                        </Button>
                    </div>
                    <Sidebar className="border-none w-full px-2" />
                </div>
            </div>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-3 left-4 z-40"
            onClick={() => setOpen(true)}
        >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
        </Button>
    )
}
