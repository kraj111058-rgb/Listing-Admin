import branchLogo from "@/assets/brand-logo-main.svg"
import { cn } from "@/lib/utils"
import {
  Bell,
  Building2,
  ChevronDown,
  CreditCard,
  ExternalLink,
  FileText,
  FolderTree,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Tv,
  Users,
  type LucideIcon
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface NavSubItem {
  label: string
  href: string
  icon: LucideIcon
}

interface NavItem {
  label: string
  href?: string
  icon: LucideIcon
  children?: NavSubItem[]
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Categories", href: "/categories", icon: FolderTree },
  { label: "States & City", href: "/states-city", icon: MapPin },
  { label: "Users", href: "/users", icon: Users },
  { label: "Listings", href: "/listings", icon: Building2 },
  { label: "Services & Products", href: "/services-products", icon: ShoppingBag },
  { label: "Custom FAQs", href: "/listing-faqs", icon: HelpCircle },
  { 
    label: "Inquiries", 
    icon: MessageSquare,
    children: [
      { label: "Contact", href: "/inquiries/contact", icon: Mail },
      { label: "Banner Ads", href: "/inquiries/banner-ads", icon: Megaphone },
      { label: "Services & Products", href: "/inquiries/services-products", icon: Package },
    ]
  },
  { label: "Advertisements", href: "/advertisements", icon: Tv },
  { label: "Subscriptions Plan", href: "/subscriptions", icon: CreditCard },
  { label: "Payments", href: "/payments", icon: Receipt },
  { label: "Blogs", href: "/blog", icon: FileText },
  { label: "Notification", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
]

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation()
  const [isInquiriesOpen, setIsInquiriesOpen] = useState<boolean>(false)

  // Helper function to close submenu when clicking outside
  const closeSubMenu = () => {
    setIsInquiriesOpen(false)
  }

  // Helper functions to check active routes
  const isActiveLink = (href: string) => {
    return href === "/" ? location.pathname === "/" : location.pathname.startsWith(href)
  }

  const isParentActive = (children?: NavSubItem[]) => {
    return Boolean(children?.some((child) => location.pathname.startsWith(child.href)))
  }

  // Auto expand when an inquiry route is active, close when outside
  useEffect(() => {
    const inquiriesItem = mainNavItems.find((item) => item.children)
    if (isParentActive(inquiriesItem?.children)) {
      setIsInquiriesOpen(true)
    } else {
      closeSubMenu()
    }
  }, [location.pathname])

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col h-screen shrink-0 transition-transform duration-300 ease-in-out",
        "lg:sticky lg:top-0 lg:translate-x-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}
    >
      {/* 1. Brand Header */}
      <div className="h-20 px-5 border-b border-border flex items-center justify-between shrink-0">
        <Link
          to="/"
          onClick={() => {
            closeSubMenu()
            onClose?.()
          }}
          className="inline-flex items-center gap-1.75 group select-none min-w-0"
        >
          <img
            src={branchLogo}
            alt="OneListy"
            className="w-11.75 h-11.75 object-cover"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 leading-none">
              <span className="text-xl font-black tracking-tight text-foreground">
                One
              </span>
              <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                Listy
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 py-2">
          Management
        </p>

        {/* Main Nav Items */}
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const hasChildren = Boolean(item.children && item.children.length > 0)

          if (hasChildren && item.children) {
            const isChildActive = isParentActive(item.children)

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setIsInquiriesOpen((prev) => !prev)}
                  className={cn(
                    "w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer select-none",
                    isChildActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "size-4.5 transition-colors",
                        isChildActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200",
                      isInquiriesOpen && "rotate-180"
                    )}
                  />
                </button>

                {isInquiriesOpen && (
                  <div className="mt-1 ml-3.5 pl-2.75 border-l border-border/80 space-y-1">
                    {item.children.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = isActiveLink(subItem.href)

                      return (
                        <NavLink
                          key={subItem.href}
                          to={subItem.href}
                          onClick={onClose}
                          className={cn(
                            "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                            isSubActive
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <SubIcon
                            className={cn(
                              "size-3.5 transition-colors",
                              isSubActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <span className="truncate">{subItem.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const isLinkActive = isActiveLink(item.href!)

          return (
            <NavLink
              key={item.href}
              to={item.href!}
              end={item.href === "/"}
              onClick={() => {
                closeSubMenu()
                onClose?.()
              }}
              className={cn(
                "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isLinkActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4.5 transition-colors",
                  isLinkActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{item.label}</span>
            </NavLink>
          )
        })}

        {/* Shortcut to Live Web Portal */}
        <div className="pt-4 mt-4 border-t border-border">
          <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-3 mb-2">
            Shortcut
          </p>
          <a
            href="https://listing-website-six.vercel.app"
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="size-4.5 text-muted-foreground" />
              <span>View Site</span>
            </div>
          </a>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
