'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, ClipboardCheck, Truck, MapPin,
  ShoppingCart, Wallet, Settings, BarChart3, Bell, FileText,
  Menu, X, ChevronDown, LogOut, User, Shield,
  AlertTriangle, Tag, Crown, RefreshCw, Megaphone, Briefcase,
} from 'lucide-react'
import Image from 'next/image'
import { NotificationsMenu } from '@/components/notifications-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/auth-context'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinkCls = "block select-none rounded-sm px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
const navLinkActiveCls = "bg-primary text-white font-medium [&_*]:!text-white"
const topLinkCls = "group flex-row h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none gap-2"
const topLinkActiveCls = "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white [&_*]:!text-white"

export default function Header() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 lg:px-6 max-w-360 mx-auto gap-4">

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-90 p-0 [&>button]:hidden">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <div className="flex items-center justify-between p-5 border-b">
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Image src="/brand/logo-event-reco.png" alt="event Reco" width={130} height={36} className="object-contain" />
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><X className="h-4 w-4" /></Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
              {[
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/organisateurs', label: 'Organisateurs', icon: Users },
                { href: '/prestataires', label: 'Prestataires', icon: Briefcase },
                { href: '/tarification', label: 'Abonnements', icon: Crown },
                { href: '/finance', label: 'Finance', icon: Wallet },
                { href: '/contenu', label: 'Blog', icon: FileText },
                { href: '/settings', label: 'Paramètres', icon: Settings },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2.5 text-sm rounded-lg hover:bg-accent transition-colors",
                    isActive(href) && "bg-primary text-white font-medium"
                  )}>
                  <Icon className={cn("h-4 w-4", isActive(href) ? "text-white" : "text-muted-foreground")} />
                  <span>{label}</span>
                </Link>
              ))}

              <div className="mt-4 border-t pt-4">
                <button
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center gap-3 px-2 py-2.5 text-sm rounded-lg text-destructive hover:bg-red-50 hover:text-destructive transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-destructive" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center md:flex-1">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/brand/logo-event-reco.png" alt="event Reco" width={130} height={36} className="object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu viewport={false} className="hidden md:flex">
          <NavigationMenuList>
            {[
              { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { href: '/organisateurs', label: 'Organisateurs', icon: Users },
              { href: '/prestataires', label: 'Prestataires', icon: Briefcase },
              { href: '/tarification', label: 'Abonnements', icon: Crown },
              { href: '/finance', label: 'Finance', icon: Wallet },
              { href: '/contenu', label: 'Blog', icon: FileText },
              { href: '/settings', label: 'Paramètres', icon: Settings },
            ].map(({ href, label, icon: Icon }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link href={href} className={cn(topLinkCls, isActive(href) && topLinkActiveCls)}>
                    <Icon className="h-4 w-4" />{label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <NotificationsMenu />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/evilrabbit.png" alt="Admin" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />Superadmin
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /><span>Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" /><span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  )
}
