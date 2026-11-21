import { Loader, UserAvatar } from "@/components/common"
import AlertModal from "@/components/common/AlertModal"
import UserRegisteredListings from "@/components/features/users/UserRegisteredListings"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserStatus } from "@/enums"
import { useUpdateUserStatus, useUserById } from "@/hooks/queries"
import { formatDate } from "@/lib/utils"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const { data: user, isLoading } = useUserById(id || "")
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus()

  if (isLoading || !user) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader fullScreen={false} text="Loading user profile..." />
      </div>
    )
  }

  const displayName = user.name || "User"

  const handleConfirmStatusChange = () => {
    const newStatus =
      user.status === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE

    updateStatus(
      { id: user.id, status: newStatus },
      {
        onSuccess: () => setIsAlertOpen(false),
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Top Bar Navigation */}
      <div>
        <button
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-fit group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Users
        </button>
      </div>

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: User Profile Card (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            {/* Profile Avatar & Info */}
            <div className="p-6">
              <UserAvatar
                name={displayName}
                src={user.avatar_url || undefined}
                className="size-20 font-extrabold shadow-sm bg-gradient-to-tr from-primary to-indigo-600 text-primary-foreground flex items-center justify-center"
                fallbackClassName="text-2xl"
              />

              {/* Name & Account Type */}
              <div className="mt-3 space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {displayName}
                </h1>
                <p className="text-xs font-medium text-muted-foreground">
                  Registered Business Owner
                </p>
              </div>

              {/* Status & Verification Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                {/* Active / Inactive Badge */}
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

                {/* Email Verification Badge */}
                <Badge
                  variant={user.verified ? "success" : "warning"}
                  className="rounded-full"
                >
                  {user.verified ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <Clock className="size-3" />
                  )}
                  {user.verified ? "Email Verified" : "Email Pending"}
                </Badge>
              </div>

              {/* Contact Details List */}
              <div className="mt-6 pt-5 border-t border-border space-y-3.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5 text-muted-foreground/70" /> Email
                  </span>
                  <a
                    href={`mailto:${user.email}`}
                    className="font-medium text-foreground hover:text-primary transition-colors truncate max-w-[190px]"
                  >
                    {user.email}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground/70" /> Phone
                  </span>
                  <a
                    href={user.phone ? `tel:${user.phone}` : undefined}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {user.phone || "—"}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground/70" /> City
                  </span>
                  <span className="font-medium text-foreground">{user.city || "—"}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground/70" /> Joined
                  </span>
                  <span className="font-medium text-foreground">{formatDate(user.created_at)}</span>
                </div>
              </div>

              {/* Administrative Status Toggle Section */}
              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">
                      Account Status
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Control owner login and listing access
                    </p>
                  </div>

                  {user.status === UserStatus.ACTIVE ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => setIsAlertOpen(true)}
                      className="border-border bg-muted/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 font-semibold cursor-pointer"
                    >
                      <UserX className="size-3.5" /> Inactivate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => setIsAlertOpen(true)}
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold cursor-pointer"
                    >
                      <UserCheck className="size-3.5" /> Activate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registered Business Listings (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <UserRegisteredListings listings={[]} />
        </div>
      </div>

      <AlertModal
        open={isAlertOpen}
        onOpenChange={(open) => {
          if (!isUpdatingStatus && !open) {
            setIsAlertOpen(false)
          }
        }}
        isLoading={isUpdatingStatus}
        title={
          user.status === UserStatus.ACTIVE
            ? "Inactivate User Account"
            : "Activate User Account"
        }
        description={
          user.status === UserStatus.ACTIVE
            ? `Are you sure you want to Inactivate ${displayName}? Their account will be marked as inactive and business listings will be paused.`
            : `Are you sure you want to Activate ${displayName}? Their account and business listings will be restored to active.`
        }
        confirmLabel={
          isUpdatingStatus
            ? "Updating..."
            : user.status === UserStatus.ACTIVE
            ? "Inactivate"
            : "Activate"
        }
        confirmVariant={user.status === UserStatus.ACTIVE ? "destructive" : "success"}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  )
}

export default UserDetails

