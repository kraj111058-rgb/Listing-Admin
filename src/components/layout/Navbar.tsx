import { AlertModal, PopoverMenu, UserAvatar } from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@/components/ui/popover"
import { mockNotifications, type NotificationItem, type NotificationType } from "@/data/dummyData"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Bell,
  BellOff,
  Building2,
  CheckCheck,
  CreditCard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User
} from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface HeaderConfig {
  title: string
  subtitle: string
}

interface NavbarProps {
  onMenuToggle?: () => void
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "listing":
      return Building2
    case "inquiry":
      return MessageSquare
    case "payment":
      return CreditCard
    case "user":
      return User
    case "broadcast":
      return Megaphone
    default:
      return Bell
  }
}

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "listing":
      return "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    case "inquiry":
      return "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
    case "payment":
      return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    case "user":
      return "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20"
    case "broadcast":
      return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
    default:
      return "text-primary bg-primary/10 border-primary/20"
  }
}

const routeHeaders: Record<string, HeaderConfig> = {
  "/": {
    title: "Hello, Raj Sharma",
    subtitle: "Here's what's happening today.",
  },
  "/listings": {
    title: "Listings",
    subtitle: "Here's what's happening with your listings.",
  },
  "/categories": {
    title: "Categories",
    subtitle: "Manage and organize your portal categories.",
  },
  "/categories/create": {
    title: "Create Category",
    subtitle: "Add a new business category to your directory.",
  },
  "/users": {
    title: "Users",
    subtitle: "Manage registered members and permissions.",
  },
  "/inquiries/contact": {
    title: "Contact Inquiries",
    subtitle: "Review incoming general contact messages and inquiries.",
  },
  "/inquiries/banner-ads": {
    title: "Banner Ads Inquiries",
    subtitle: "Manage banner placement requests and advertising leads.",
  },
  "/inquiries/services-products": {
    title: "Services & Products Inquiries",
    subtitle: "Review inquiries and quote requests for listings.",
  },
  "/services-products": {
    title: "Services & Products",
    subtitle: "Manage catalog offerings, listings items, and inventory.",
  },
  "/states-city": {
    title: "States & City",
    subtitle: "Configure active states, districts, and serviceable cities.",
  },
  "/advertisements": {
    title: "Advertisements",
    subtitle: "Manage banner ads, placements, and sponsored campaigns across the platform.",
  },
  "/subscriptions": {
    title: "Subscriptions Plan",
    subtitle: "Manage membership plans, pricing tiers, and active subscribers.",
  },
  "/payments": {
    title: "Payments",
    subtitle: "Track billing transactions, payment statuses, and revenue.",
  },
  "/notifications": {
    title: "Notifications",
    subtitle: "Send alerts, system messages, and announcements.",
  },
  "/blog": {
    title: "Blogs",
    subtitle: "Write, edit, and publish platform blogs, guides, and announcements.",
  },
  "/blog/create": {
    title: "Create Blog",
    subtitle: "Draft and publish a new blog post for the platform.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Configure portal options and system settings.",
  },
}

const defaultHeader: HeaderConfig = {
  title: "Hello, Raj Sharma",
  subtitle: "Here's what's happening today.",
}

const getHeaderConfig = (pathname: string): HeaderConfig => {
  if (routeHeaders[pathname]) return routeHeaders[pathname]
  if (pathname.startsWith("/categories/") && pathname.endsWith("/edit")) {
    return {
      title: "Edit Category",
      subtitle: "Update category details and configurations.",
    }
  }
  if (pathname.startsWith("/blog/") && pathname.endsWith("/edit")) {
    return {
      title: "Edit Blog",
      subtitle: "Update and revise your published or draft blog post.",
    }
  }
  if (pathname.startsWith("/users/")) {
    return {
      title: "User Profile",
      subtitle: "Review user activities and account details.",
    }
  }
  return defaultHeader
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentHeader = getHeaderConfig(location.pathname)

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    mockNotifications.slice(0, 5)
  )
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const toggleDarkMode = () => setIsDark(!isDark)

  return (
    <header className="h-20 border-b border-border bg-card sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 shrink-0">
      {/* Left: Mobile Menu Toggle & Greeting Header */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden rounded-[10px] bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          title="Open Menu"
        >
          <Menu className="size-4.5" />
        </Button>

        <div className="hidden sm:flex flex-col justify-center min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-tight truncate">
            {currentHeader.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block truncate">
            {currentHeader.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & User Controls */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="rounded-[10px] bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {isDark ? <Sun className="size-4.5 text-amber-400" /> : <Moon className="size-4.5" />}
        </Button>

        {/* Notification Bell with PopoverMenu */}
        <PopoverMenu
          align="end"
          side="bottom"
          sideOffset={6}
          contentClass="w-80 sm:w-92 p-0 rounded-xl shadow-xl border border-border bg-popover overflow-hidden"
          trigger={
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-[10px] bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            >
              <Bell className="size-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-2 size-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
              )}
            </Button>
          }
        >
          <div>
            {/* Popover Header */}
            <div className="flex items-center justify-between p-3.75 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {unreadCount} New
                  </Badge>
                )}
              </div>

              {unreadCount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="h-7 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1 cursor-pointer rounded-md transition-colors"
                >
                  <CheckCheck className="size-3.5 text-primary" />
                  <span>Mark all read</span>
                </Button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-85 overflow-y-auto divide-y divide-border/50">
              {notifications.length === 0 ? (
                <div className="p-9 text-center text-muted-foreground space-y-1.5">
                  <BellOff className="size-8 mx-auto text-muted-foreground/40" />
                  <p className="text-sm sm:text-base font-semibold text-foreground">No notifications yet</p>
                  <p className="text-xs sm:text-[13px]">You're all caught up with alerts.</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = getNotificationIcon(notif.type)
                  const iconStyle = getNotificationColor(notif.type)
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={cn(
                        "p-3 sm:p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-muted/50",
                        !notif.read && "dark:bg-primary/10"
                      )}
                    >
                      <div
                        className={cn(
                          "size-8.5 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 shadow-2xs",
                          iconStyle
                        )}
                      >
                        <Icon className="size-4.75" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-xs sm:text-[13px] truncate",
                              notif.read ? "font-medium text-foreground" : "font-bold text-foreground"
                            )}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="size-1.75 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1 font-medium">
                          {notif.createdAt}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Popover Footer */}
            <div className="p-2 border-t border-border bg-muted/20 text-center">
              <PopoverClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/notifications")}
                  className="w-full h-8 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 gap-1.5 justify-center cursor-pointer rounded-lg transition-colors"
                >
                  <span>View All Notifications</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverMenu>

        {/* Profile Avatar with PopoverMenu */}
        <div className="pl-2  border-l border-border">
          <PopoverMenu
            align="end"
            side="bottom"
            sideOffset={6}
            contentClass="w-60 p-0 rounded-xl shadow-xl border border-border bg-popover overflow-hidden"
            trigger={
              <Button
                size="icon"
                className="rounded-[10px]! cursor-pointer! border-primary border-none! select-none focus:outline-hidden transition-opacity hover:opacity-90 shrink-0"
              >
                <UserAvatar
                  name="Raj Sharma"
                  className="size-9! rounded-[10px]! shadow-xs"
                  fallbackClassName="text-sm rounded-[10px]! font-bold bg-primary text-primary-foreground"
                />
              </Button>
            }
          >
            <div>
              {/* User Header */}
              <div className="p-3 bg-muted/30 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    name="Raj Sharma"
                    className="size-10! rounded-[10px]! border-primary/20 shadow-xs"
                    fallbackClassName="text-sm rounded-[10px]! font-bold bg-primary text-primary-foreground"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">Raj Sharma</h4>
                    <p className="text-xs text-primary font-semibold">
                      Super Admin
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-1.5 space-y-0.5">
                <PopoverClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/settings")}
                    className="w-full justify-start gap-2.5 h-9 px-2.5 text-sm font-medium text-foreground hover:bg-muted cursor-pointer rounded-lg transition-colors"
                  >
                    <Settings className="size-4.5 text-muted-foreground" />
                    <span>Settings</span>
                  </Button>
                </PopoverClose>

                <PopoverClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate("/notifications")}
                    className="w-full justify-start gap-2.5 h-9 px-2.5 text-sm font-medium text-foreground hover:bg-muted cursor-pointer rounded-lg transition-colors"
                  >
                    <Bell className="size-4.5 text-muted-foreground" />
                    <span>Notifications</span>
                  </Button>
                </PopoverClose>
              </div>

              <div className="p-1.5 border-t border-border bg-muted/10">
                <PopoverClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsSignOutModalOpen(true)}
                    className="w-full justify-start gap-2.5 h-9 px-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </Button>
                </PopoverClose>
              </div>
            </div>
          </PopoverMenu>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <AlertModal
        open={isSignOutModalOpen}
        onOpenChange={setIsSignOutModalOpen}
        title="Sign Out"
        description="Are you sure you want to sign out of your account? You will need to log back in to access the admin portal."
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onConfirm={() => navigate("/login")}
      />
    </header>
  )
}


export default Navbar;