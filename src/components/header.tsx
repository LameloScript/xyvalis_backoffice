'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, ClipboardCheck, Truck, MapPin,
  ShoppingCart, Wallet, Settings, BarChart3, Bell, FileText,
  Menu, X, ChevronDown, LogOut, User, Shield,
  AlertTriangle, Tag, Crown, RefreshCw, Megaphone,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const navLinkCls = "block select-none rounded-sm px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
const navLinkActiveCls = "bg-primary text-white font-medium [&_*]:!text-white"
const topLinkCls = "group flex-row h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none gap-2"
const topLinkActiveCls = "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white [&_*]:!text-white"
const topGroupActiveCls = "bg-primary/10 text-primary [&_*]:!text-primary"

export default function Header() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const isGroupActive = (hrefs: string[]) => hrefs.some((h) => isActive(h))

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-6 max-w-360 mx-auto gap-4">

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
                <Image src="/assets/logo-brand/logo.png" alt="Xyvalis Delivery" width={130} height={36} className="object-contain" />
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><X className="h-4 w-4" /></Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col gap-1 p-4 overflow-y-auto">
              {[
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/utilisateurs', label: 'Utilisateurs', icon: Users },
                { href: '/validations', label: 'Validations', icon: ClipboardCheck },
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

              {([
                { label: 'Opérations', icon: Truck, items: [
                  { href: '/livreurs', label: 'Livreurs' },
                  { href: '/points-relais', label: 'Points relais' },
                  { href: '/commandes', label: 'Commandes' },
                  { href: '/litiges', label: 'Litiges' },
                ]},
              ]).map((g) => {
                const groupActive = isGroupActive(g.items.map((i) => i.href))
                return (
                  <Collapsible key={g.label} className="space-y-1" defaultOpen={groupActive}>
                    <CollapsibleTrigger className={cn(
                      "flex items-center justify-between w-full px-2 py-2.5 text-sm rounded-lg transition-colors hover:bg-accent",
                      groupActive ? "text-primary font-medium" : "text-muted-foreground"
                    )}>
                      <div className="flex items-center gap-3"><g.icon className="h-4 w-4" /><span>{g.label}</span></div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-8 space-y-0.5 pt-1">
                      {g.items.map(({ href, label }) => (
                        <Link key={href} href={href} onClick={() => setOpen(false)}
                          className={cn(
                            "block px-2 py-2 text-sm rounded-lg hover:bg-accent transition-colors",
                            isActive(href) && "bg-primary text-white font-medium"
                          )}>
                          {label}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}

              <Link href="/finance" onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-2 py-2.5 text-sm rounded-lg hover:bg-accent transition-colors",
                  isActive('/finance') && "bg-primary text-white font-medium"
                )}>
                <Wallet className={cn("h-4 w-4", isActive('/finance') ? "text-white" : "text-muted-foreground")} /><span>Finance</span>
              </Link>

              {([
                { label: 'Marketing', icon: Megaphone, items: [
                  { href: '/promotions', label: 'Promotions' },
                  { href: '/notifications', label: 'Notifications' },
                  { href: '/contenu', label: 'Contenu & Support' },
                ]},
                { label: 'Système', icon: Settings, items: [
                  { href: '/tarification', label: 'Tarification' },
                  { href: '/admins', label: 'Profils admin' },
                  { href: '/Xyvalis', label: 'Xyvalis' },
                ]},
              ]).map((g) => {
                const groupActive = isGroupActive(g.items.map((i) => i.href))
                return (
                  <Collapsible key={g.label} className="space-y-1" defaultOpen={groupActive}>
                    <CollapsibleTrigger className={cn(
                      "flex items-center justify-between w-full px-2 py-2.5 text-sm rounded-lg transition-colors hover:bg-accent",
                      groupActive ? "text-primary font-medium" : "text-muted-foreground"
                    )}>
                      <div className="flex items-center gap-3"><g.icon className="h-4 w-4" /><span>{g.label}</span></div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-8 space-y-0.5 pt-1">
                      {g.items.map(({ href, label }) => (
                        <Link key={href} href={href} onClick={() => setOpen(false)}
                          className={cn(
                            "block px-2 py-2 text-sm rounded-lg hover:bg-accent transition-colors",
                            isActive(href) && "bg-primary text-white font-medium"
                          )}>
                          {label}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}

              {[
                { href: '/analytics', label: 'Analytics', icon: BarChart3 },
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
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center mr-4">
          <Image src="/assets/logo-brand/logo.png" alt="Xyvalis Delivery" width={130} height={36} className="object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu viewport={false} className="hidden md:flex">
          <NavigationMenuList>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/dashboard" className={cn(topLinkCls, isActive('/dashboard') && topLinkActiveCls)}>
                  <LayoutDashboard className="h-4 w-4" />Dashboard
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/utilisateurs" className={cn(topLinkCls, isActive('/utilisateurs') && topLinkActiveCls)}>
                  <Users className="h-4 w-4" />Utilisateurs
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/validations" className={cn(topLinkCls, isActive('/validations') && topLinkActiveCls)}>
                  <ClipboardCheck className="h-4 w-4" />Validations
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(isGroupActive(['/livreurs', '/points-relais', '/commandes', '/litiges']) && topGroupActiveCls)}>
                <span className="flex items-center gap-2"><Truck className="h-4 w-4" />Opérations</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid min-w-45 gap-1 p-1">
                  {[
                    { href: '/livreurs', label: 'Livreurs', icon: Truck },
                    { href: '/points-relais', label: 'Points relais', icon: MapPin },
                    { href: '/commandes', label: 'Commandes', icon: ShoppingCart },
                    { href: '/litiges', label: 'Litiges', icon: AlertTriangle },
                  ].map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <NavigationMenuLink asChild>
                        <Link href={href} className={cn(navLinkCls, isActive(href) && navLinkActiveCls)}>
                          <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />{label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/finance" className={cn(topLinkCls, isActive('/finance') && topLinkActiveCls)}>
                  <Wallet className="h-4 w-4" />Finance
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(isGroupActive(['/promotions', '/notifications', '/contenu']) && topGroupActiveCls)}>
                <span className="flex items-center gap-2"><Megaphone className="h-4 w-4" />Marketing</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid min-w-50 gap-1 p-1">
                  {[
                    { href: '/promotions', label: 'Promotions', icon: Tag },
                    { href: '/notifications', label: 'Notifications', icon: Bell },
                    { href: '/contenu', label: 'Contenu & Support', icon: FileText },
                  ].map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <NavigationMenuLink asChild>
                        <Link href={href} className={cn(navLinkCls, isActive(href) && navLinkActiveCls)}>
                          <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />{label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(isGroupActive(['/tarification', '/admins', '/Xyvalis', '/analytics']) && topGroupActiveCls)}>
                <span className="flex items-center gap-2"><Settings className="h-4 w-4" />Système</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid min-w-50 gap-1 p-1">
                  {[
                    { href: '/tarification', label: 'Tarification', icon: Settings },
                    { href: '/admins', label: 'Profils admin', icon: Crown },
                    { href: '/Xyvalis', label: 'Xyvalis', icon: RefreshCw },
                    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
                  ].map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <NavigationMenuLink asChild>
                        <Link href={href} className={cn(navLinkCls, isActive(href) && navLinkActiveCls)}>
                          <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />{label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
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
