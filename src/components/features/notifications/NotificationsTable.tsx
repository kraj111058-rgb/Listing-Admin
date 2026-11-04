import { useState, useMemo, useEffect } from "react"
import {
  Building2,
  MessageSquare,
  CreditCard,
  Users,
  Send,
  MoreVertical,
  CheckCheck,
  Trash2,
} from "lucide-react"
import { mockNotifications, type NotificationItem } from "@/data/dummyData"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AlertModal from "@/components/common/AlertModal"
import { cn } from "@/lib/utils"

const filterTabs = [
  { label: "All", value: "All" },
  { label: "Unread", value: "Unread" },
  { label: "Listings", value: "listing" },
  { label: "Inquiries", value: "inquiry" },
  { label: "Payments", value: "payment" },
  { label: "Users", value: "user" },
  { label: "Broadcasts", value: "broadcast" },
]

interface NotificationsTableProps {
  notifications?: NotificationItem[]
  onNotificationsChange?: (items: NotificationItem[]) => void
}

const NotificationsTable = ({
  notifications: initialNotifications,
  onNotificationsChange,
}: NotificationsTableProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    () => initialNotifications || [...mockNotifications]
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("All")
  const [deleteModalItem, setDeleteModalItem] = useState<NotificationItem | null>(null)

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications)
    }
  }, [initialNotifications])

  const updateList = (newItems: NotificationItem[]) => {
    setNotifications(newItems)
    onNotificationsChange?.(newItems)
  }

  // Filter logic: Search by title, message, recipient and filter by category tab
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        query === "" ||
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)

      let matchesTab = true
      if (selectedTab === "Unread") {
        matchesTab = !item.read
      } else if (selectedTab !== "All") {
        matchesTab = item.type === selectedTab
      }

      return matchesSearch && matchesTab
    })
  }, [notifications, searchQuery, selectedTab])

  // Mark as Read
  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item
    )
    updateList(updated)
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteModalItem) return
    const updated = notifications.filter((item) => item.id !== deleteModalItem.id)
    updateList(updated)
    setDeleteModalItem(null)
  }

  // Helper icon for notification type
  const getTypeIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "listing":
        return <Building2 className="size-4 text-indigo-500" />
      case "inquiry":
        return <MessageSquare className="size-4 text-blue-500" />
      case "payment":
        return <CreditCard className="size-4 text-emerald-500" />
      case "user":
        return <Users className="size-4 text-purple-500" />
      case "broadcast":
        return <Send className="size-4 text-amber-500" />
    }
  }

  const columns = useMemo<ColumnDef<NotificationItem>[]>(
    () => [
      {
        id: "notification",
        header: "Notification",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center gap-3 py-1">
              <div
                className={cn(
                  "size-9 rounded-lg flex items-center justify-center shrink-0 border border-border",
                  item.read ? "bg-muted/40" : "bg-primary/10 border-primary/20"
                )}
              >
                {getTypeIcon(item.type)}
              </div>
              <div className="min-w-0 flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold truncate",
                    item.read ? "text-foreground font-medium" : "text-foreground font-bold"
                  )}
                >
                  {item.title}
                </span>
                {!item.read && (
                  <span className="size-2 rounded-full bg-primary shrink-0" />
                )}
              </div>
            </div>
          )
        },
      },
      {
        id: "message",
        header: "Message",
        cell: ({ row }) => (
          <p
            className="text-xs text-muted-foreground line-clamp-2 max-w-md leading-relaxed"
            title={row.original.message}
          >
            {row.original.message}
          </p>
        ),
      },
      {
        id: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.original.type;
          const item= row.original;

          switch (type) {
            case "listing":
              return (
                <Badge
                  variant="outline"
                  className="text-xs font-semibold rounded-full border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300"
                >
                  Listing
                </Badge>
              )
            case "inquiry":
              return (
                <Badge
                  variant="outline"
                  className="text-xs font-semibold rounded-full border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/60 dark:text-blue-300"
                >
                  Inquiry
                </Badge>
              )
            case "payment":
              return (
                <Badge
                  variant="outline"
                  className="text-xs font-semibold rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-300"
                >
                  Payment
                </Badge>
              )
            case "user":
              return (
                <Badge
                  variant="outline"
                  className="text-xs font-semibold rounded-full border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:border-purple-900/60 dark:text-purple-300"
                >
                  User
                </Badge>
              )
            case "broadcast":
              return (
                <div className="flex flex-col items-start gap-1">
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold rounded-full border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-300"
                  >
                    Broadcast
                  </Badge>
                  {item.recipientName && (
                    <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                      To: {item.recipientName}
                    </span>
                  )}
                </div>
              )
            default:
              return (
                <Badge variant="secondary" className="text-xs font-semibold rounded-full">
                  General
                </Badge>
              )
          }
        },
      },
      {
        id: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.createdAt}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex items-center justify-end">
              <PopoverMenu
                align="end"
                contentClass="w-40"
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                }
              >
                <div className="flex flex-col gap-0.5">
                  {!item.read && (
                    <PopoverClose asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(item.id)}
                        className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-foreground cursor-pointer rounded-lg transition-colors group"
                      >
                        <CheckCheck className="size-3.5 text-emerald-600 transition-colors" />
                        <span>Mark as Read</span>
                      </Button>
                    </PopoverClose>
                  )}

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalItem(item)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                    >
                      <Trash2 className="size-3.5 text-destructive transition-colors" />
                      <span>Delete Alert</span>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverMenu>
            </div>
          )
        },
      },
    ],
    [notifications]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredNotifications}
        searchPlaceholder="Search notifications by title, message..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        toolbarActions={
          <Tabs
            value={selectedTab}
            onValueChange={(val) => setSelectedTab(val)}
            className="self-start sm:self-auto max-w-full overflow-x-auto"
          >
            <TabsList className="h-9 p-1 bg-muted/40 border border-border rounded-lg gap-1 max-w-full overflow-x-auto">
              {filterTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-7 px-3 text-xs font-semibold rounded-lg shrink-0 cursor-pointer"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
        emptyMessage="No notifications found matching your criteria."
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        open={!!deleteModalItem}
        onOpenChange={(open) => !open && setDeleteModalItem(null)}
        title="Delete Notification"
        description={
          deleteModalItem
            ? `Are you sure you want to remove "${deleteModalItem.title}" from notifications?`
            : ""
        }
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default NotificationsTable
