import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle2,
  XCircle,
  Building2,
  Mail,
  Phone,
  Clock,
  MoreVertical,
  User,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react"
import { mockUsers, type UserItem } from "@/data/dummyData"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { PopoverClose } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AlertModal from "@/components/common/AlertModal"
import { UserAvatar } from "@/components/common"
import { cn } from "@/lib/utils"

const statusFilters = ["All", "Active", "Inactive"]

const UsersTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [statusModalUser, setStatusModalUser] = useState<UserItem | null>(null)
  const [deleteModalUser, setDeleteModalUser] = useState<UserItem | null>(null)

  // Filter logic: Business owners only, search by name, email, or phone
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        query === "" ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)

      const matchesStatus =
        selectedStatus === "All" || user.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [users, searchQuery, selectedStatus])

  // Column Definitions (Clean v8 syntax: Only UserItem needed!)
  const columns = useMemo<ColumnDef<UserItem>[]>(
    () => [
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const user = row.original

          return (
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} />
              <span className="font-semibold text-foreground text-sm truncate">
                {user.name}
              </span>
            </div>
          )
        },
      },
      {
        id: "contact",
        header: "Contact",
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="size-3 text-foreground/70 shrink-0" />
                <span className="truncate text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                <Phone className="size-3 text-foreground/70 shrink-0" />
                <span>{user.phone}</span>
              </div>
            </div>
          )
        },
      },
      {
        id: "listings",
        header: "Listings",
        cell: ({ row }) => {
          const user = row.original
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground whitespace-nowrap">
              <Building2 className="size-3.5 text-foreground/70" />
              {user.totalListings}
            </span>
          )
        },
      },  
      {
        id: "verified",
        header: "Email Verification",
        cell: ({ row }) => {
          const user = row.original
          return (
            <Badge
              variant={user.verified ? "success" : "warning"}
              className="rounded-full"
            >
              {user.verified ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <Clock className="size-3" />
              )}
              {user.verified ? "Verified" : "Unverified"}
            </Badge>
          )
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const user = row.original
          return (
            <Badge
              variant={user.status === "Active" ? "success" : "danger"}
              className="rounded-full"
            >
              {user.status === "Active" ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <XCircle className="size-3" />
              )}
              {user.status}
            </Badge>
          )
        },
      },
      {
        id: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {row.original.createdAt}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
         <div className="flex items-center justify-end">
            <PopoverMenu
              align="end"
              contentClass="w-36"
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/users/${row.original.id}`)}
                  className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary text-foreground cursor-pointer rounded-lg transition-colors group"
                >
                  <User className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span>Profile</span>
                </Button>

                <PopoverClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusModalUser(row.original)}
                    className={cn(
                      "w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-foreground cursor-pointer rounded-lg transition-colors group",
                      row.original.status === "Active"
                        ? "hover:bg-destructive/10 hover:text-destructive"
                        : "hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {row.original.status === "Active" ? (
                      <UserX className="size-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
                    ) : (
                      <UserCheck className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                    <span>
                      {row.original.status === "Active" ? "Inactivate" : "Activate"}
                    </span>
                  </Button>
                </PopoverClose>

                <PopoverClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteModalUser(row.original)}
                    className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                  >
                    <Trash2 className="size-3.5 text-destructive transition-colors" />
                    <span>Delete</span>
                  </Button>
                </PopoverClose>
              </div>
            </PopoverMenu>
        </div>
        ),
      },
    ],
    [navigate, setStatusModalUser, setDeleteModalUser]
  )

  const handleConfirmStatusChange = () => {
    if (!statusModalUser) return
    const newStatus = statusModalUser.status === "Active" ? "Inactive" : "Active"
    setUsers((prev) =>
      prev.map((u) =>
        u.id === statusModalUser.id ? { ...u, status: newStatus } : u
      )
    )
    const inMock = mockUsers.find((u) => u.id === statusModalUser.id)
    if (inMock) {
      inMock.status = newStatus
    }
    setStatusModalUser(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteModalUser) return
    setUsers((prev) => prev.filter((u) => u.id !== deleteModalUser.id))
    const index = mockUsers.findIndex((u) => u.id === deleteModalUser.id)
    if (index !== -1) {
      mockUsers.splice(index, 1)
    }
    setDeleteModalUser(null)
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Search by name, email, or phone..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        toolbarActions={
          <Tabs
            value={selectedStatus}
            onValueChange={(val) => setSelectedStatus(val)}
            className="self-start sm:self-auto"
          >
            <TabsList className="h-9 p-1 bg-muted/40 border border-border rounded-lg gap-1">
              {statusFilters.map((st) => (
                <TabsTrigger
                  key={st}
                  value={st}
                  className="h-7 px-3 text-xs font-semibold rounded-lg"
                >
                  {st}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
        emptyMessage="No users found matching your search and filter criteria."
      />

      <AlertModal
        open={!!statusModalUser}
        onOpenChange={(open) => !open && setStatusModalUser(null)}
        title={
          statusModalUser?.status === "Active"
            ? "Inactivate User Account"
            : "Activate User Account"
        }
        description={
          statusModalUser?.status === "Active"
            ? `Are you sure you want to Inactivate ${statusModalUser?.name}? Their account will be marked as inactive and business listings will be paused.`
            : `Are you sure you want to Activate ${statusModalUser?.name}? Their account and business listings will be restored to active.`
        }
        confirmLabel={
          statusModalUser?.status === "Active" ? "Inactivate" : "Activate"
        }
        confirmVariant={
          statusModalUser?.status === "Active" ? "destructive" : "success"
        }
        onConfirm={handleConfirmStatusChange}
      />

      {/* Delete User Confirmation Modal */}
      <AlertModal
        open={!!deleteModalUser}
        onOpenChange={(open) => !open && setDeleteModalUser(null)}
        title="Delete User Account"
        description={
          deleteModalUser
            ? `Are you sure you want to permanently delete ${deleteModalUser.name}? This action cannot be undone and will permanently remove their account and all listings.`
            : ""
        }
        confirmLabel="Delete User"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default UsersTable