'use client'

import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Mock data
const initialNotifications = [
  {
    id: 1,
    title: 'Nouvelle commande',
    description: 'Vous avez reçu une nouvelle commande de Jean Dupont.',
    time: 'Il y a 2 min',
    unread: true,
  },
  {
    id: 2,
    title: 'Stock faible',
    description: 'Le produit "Chaussures Nike Air" est presque épuisé.',
    time: 'Il y a 1 heure',
    unread: true,
  },
  {
    id: 3,
    title: 'Nouveau commentaire',
    description: 'Marie a laissé un avis sur votre produit.',
    time: 'Il y a 3 heures',
    unread: false,
  },
]

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      )
    )
  }

  const markAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent closing the menu
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="px-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-transparent"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer focus:bg-accent",
                  notification.unread ? "bg-blue-50/50" : ""
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span className={cn("font-medium text-sm", notification.unread ? "text-foreground" : "text-muted-foreground")}>
                    {notification.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.description}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full justify-center text-center text-xs text-blue-600 cursor-pointer focus:text-blue-700">
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
