import { UserAvatar } from "@/components/common"
import AlertModal from "@/components/common/AlertModal"
import DataTable, { type ColumnDef } from "@/components/common/DataTable"
import PopoverMenu from "@/components/common/PopoverMenu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PopoverClose } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserStatus } from "@/enums"
import {
  useDeleteUser,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/queries"
import { useDebounce } from "@/hooks/useDebounce"
import { cn, formatDate } from "@/lib/utils"
import type { UserProfileResponse } from "@/types"
import {
  CheckCircle2,
  Clock,
  Mail,
  MoreVertical,
  Phone,
  Trash2,
  User,
  UserCheck,
  UserX,
  XCircle
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

const statusFilters = ["All", "Active", "Inactive"]

const UsersTable = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageLimit = 10
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [statusModalUser, setStatusModalUser] =
    useState<UserProfileResponse | null>(null)
  const [deleteModalUser, setDeleteModalUser] =
    useState<UserProfileResponse | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 400)

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, selectedStatus])

  // 1. Fetch live users from Supabase with React Query
  const { data: usersResponse, isLoading } = useUsers({
    page,
    pageLimit,
    search: debouncedSearch,
    status:
      selectedStatus === "All" ? undefined : (selectedStatus as UserStatus),
  })

  const users = usersResponse?.data ?? []
  const total = usersResponse?.total ?? 0
  const hasActiveFilter = Boolean(searchQuery.trim()) || selectedStatus !== "All"

  // 2. Mutations
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus()
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

  // Column Definitions
  const columns = useMemo<ColumnDef<UserProfileResponse>[]>(
    () => [
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const user = row.original
          const displayName = user.name || "User"

          return (
            <div className="flex items-center gap-3">
              <UserAvatar name={displayName} src={user.avatar_url || undefined} />
              <span className="font-semibold text-foreground text-sm truncate">
                {displayName}
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
                <span>{user.phone || "—"}</span>
              </div>
            </div>
          )
        },
      },
      {
        id: "city",
        header: "City",
        cell: ({ row }) => {
          const user = row.original
          return (
            <span className="text-xs font-medium text-foreground whitespace-nowrap">
              {user.city || "—"}
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
              variant={user.status === UserStatus.ACTIVE ? "success" : "danger"}
              className="rounded-full"
            >
              {user.status === UserStatus.ACTIVE ? (
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
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original
          return (
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
                    onClick={() => navigate(`/users/${user.id}`)}
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
                      onClick={() => setStatusModalUser(user)}
                      className={cn(
                        "w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-foreground cursor-pointer rounded-lg transition-colors group",
                        user.status === UserStatus.ACTIVE
                          ? "hover:bg-destructive/10 hover:text-destructive"
                          : "hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {user.status === UserStatus.ACTIVE ? (
                        <UserX className="size-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
                      ) : (
                        <UserCheck className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                      <span>
                        {user.status === UserStatus.ACTIVE
                          ? "Inactivate"
                          : "Activate"}
                      </span>
                    </Button>
                  </PopoverClose>

                  <PopoverClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModalUser(user)}
                      className="w-full justify-start gap-2 h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer rounded-lg transition-colors group"
                    >
                      <Trash2 className="size-3.5 text-destructive transition-colors" />
                      <span>Delete</span>
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverMenu>
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  const handleConfirmStatusChange = () => {
    if (!statusModalUser) return
    const newStatus =
      statusModalUser.status === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE

    updateStatus(
      { id: statusModalUser.id, status: newStatus },
      {
        onSuccess: () => setStatusModalUser(null),
      }
    )
  }

  const handleConfirmDelete = () => {
    if (!deleteModalUser) return
    deleteUser(
      { id: deleteModalUser.id, avatarUrl: deleteModalUser.avatar_url },
      {
        onSuccess: () => setDeleteModalUser(null),
      }
    )
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search by name, email, or phone..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        total={total}
        currentPage={page}
        onPageChange={setPage}
        pageLimit={pageLimit}
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
        emptyMessage={
          hasActiveFilter
            ? "No users found matching your search and filter criteria."
            : "No users found."
        }
      />

      {/* Status Change Confirmation Modal */}
      <AlertModal
        open={!!statusModalUser}
        onOpenChange={(open) => {
          if (!isUpdatingStatus && !open) {
            setStatusModalUser(null)
          }
        }}
        isLoading={isUpdatingStatus}
        title={
          statusModalUser?.status === UserStatus.ACTIVE
            ? "Inactivate User Account"
            : "Activate User Account"
        }
        description={
          statusModalUser?.status === UserStatus.ACTIVE
            ? `Are you sure you want to inactivate ${
                statusModalUser?.name || statusModalUser?.email
              }? Their account will be marked as inactive and they will not be able to log in.`
            : `Are you sure you want to activate ${
                statusModalUser?.name || statusModalUser?.email
              }? Their account will be restored to active.`
        }
        confirmLabel={
          statusModalUser?.status === UserStatus.ACTIVE
            ? "Inactivate"
            : "Activate"
        }
        confirmVariant={
          statusModalUser?.status === UserStatus.ACTIVE
            ? "destructive"
            : "success"
        }
        onConfirm={handleConfirmStatusChange}
      />

      {/* Delete User Confirmation Modal */}
      <AlertModal
        open={!!deleteModalUser}
        onOpenChange={(open) => {
          if (!isDeleting && !open) {
            setDeleteModalUser(null)
          }
        }}
        isLoading={isDeleting}
        title="Delete User Account"
        description={
          deleteModalUser
            ? `Are you sure you want to permanently delete ${
                deleteModalUser.name || deleteModalUser.email
              }? This action cannot be undone and will permanently remove their profile.`
            : ""
        }
        confirmLabel={isDeleting ? "Deleting..." : "Delete User"}
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

export default UsersTable
