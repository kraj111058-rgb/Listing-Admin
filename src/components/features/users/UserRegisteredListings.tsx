import { Link } from "react-router-dom"
import {
  Building2,
  ExternalLink,
  Star,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Eye,
  Crown,
} from "lucide-react"
import { mockListings, type UserListingRef } from "@/data/dummyData"
import { Badge } from "@/components/ui/badge"

interface UserRegisteredListingsProps {
  listings: UserListingRef[]
}

const UserRegisteredListings = ({ listings }: UserRegisteredListingsProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                Registered Businesses
              </h3>
              <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-transparent font-semibold px-2">
                {listings.length}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live business listings managed under this account
            </p>
          </div>
        </div>

        {listings.length > 0 && (
          <Link
            to="/listings"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Manage All <ExternalLink className="size-3" />
          </Link>
        )}
      </div>

      {/* Content */}
      {listings.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="size-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground border border-border">
            <Building2 className="size-7" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              No Registered Businesses Yet
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              This owner has not added any business profiles to the platform yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {listings.map((item) => {
            const full = mockListings.find((l) => l.id === item.id)
            const name = item.name || full?.name || "Business Listing"
            const category = item.category || full?.category || "Business"
            const city = item.city || (full ? `${full.city}, ${full.state}` : "")
            const rating = item.rating ?? full?.rating ?? 0
            const reviews = item.reviews ?? full?.reviews ?? 0
            const logo = item.logo || full?.logo
            const plan = item.plan || full?.plan || "Free"
            const rawStatus = (item.status === ("Verified" as any) ? "Approved" : item.status) || full?.status || "Approved"
            const status = rawStatus as "Approved" | "Pending" | "Rejected"
            const lat = item.latitude || full?.latitude
            const lng = item.longitude || full?.longitude
            const mapUrl =
              lat && lng
                ? `https://www.google.com/maps?q=${lat},${lng}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + (city ? " " + city : ""))}`

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-all group"
              >
                {/* Left: Cover Image + Listing Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Cover Image / Logo Thumbnail */}
                  <Link
                    to={`/listings/${item.id}`}
                    className="relative size-12 sm:size-14 rounded-xl overflow-hidden border border-border shrink-0 bg-muted/40 group/img flex items-center justify-center cursor-pointer shadow-2xs"
                    title={name}
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={name}
                        className="size-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-primary/10 text-primary">
                        <Building2 className="size-6" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="min-w-0 space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/listings/${item.id}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                        title={name}
                      >
                        {name}
                      </Link>
                    </div>

                    {/* Meta: Category, Plan, Reviews/Rating, City */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="info" className="text-[11px] font-semibold py-0.5 px-2">
                        {category}
                      </Badge>

                      {plan === "Featured Pro" && (
                        <Badge
                          variant="info"
                          className="gap-1 text-[11px] font-semibold py-0.5 px-2 bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20 shadow-2xs"
                        >
                          <Crown className="size-3 text-purple-600 dark:text-purple-400" />
                          Featured Pro
                        </Badge>
                      )}
                      {plan === "Featured" && (
                        <Badge
                          variant="warning"
                          className="gap-1 text-[11px] font-semibold py-0.5 px-2 shadow-2xs"
                        >
                          <Crown className="size-3 text-amber-600" />
                          Featured
                        </Badge>
                      )}
                      {plan === "Free" && (
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-medium py-0.5 px-2"
                        >
                          Free
                        </Badge>
                      )}

                      <span className="text-muted-foreground/40">•</span>

                      <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        <span>{rating}</span>
                        <span className="text-muted-foreground/70 font-normal">
                          ({reviews} {reviews === 1 ? "review" : "reviews"})
                        </span>
                      </span>

                      {city && (
                        <>
                          <span className="text-muted-foreground/40 hidden sm:inline">•</span>
                          <span className="hidden sm:inline-flex items-center gap-1 text-muted-foreground/80">
                            <MapPin className="size-3 text-muted-foreground/60" />
                            <span>{city}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status Badge + Map Open Icon + Eye Details Icon */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {/* Status Badge */}
                  {status === "Approved" && (
                    <Badge variant="success" className="rounded-full gap-1 text-xs font-semibold px-2.5 py-0.5">
                      <CheckCircle2 className="size-3" />
                      Approved
                    </Badge>
                  )}
                  {status === "Pending" && (
                    <Badge variant="warning" className="rounded-full gap-1 text-xs font-semibold px-2.5 py-0.5">
                      <Clock className="size-3" />
                      Pending
                    </Badge>
                  )}
                  {status === "Rejected" && (
                    <Badge variant="danger" className="rounded-full gap-1 text-xs font-semibold px-2.5 py-0.5">
                      <XCircle className="size-3" />
                      Rejected
                    </Badge>
                  )}

                  {/* Map Open Icon */}
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Google Maps"
                    className="size-8 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary flex items-center justify-center transition-all shadow-2xs cursor-pointer group/map"
                  >
                    <MapPin className="size-4 group-hover/map:scale-110 transition-transform" />
                  </a>

                  {/* View Details Eye Icon */}
                  <Link
                    to={`/listings/${item.id}`}
                    title="View Listing Details"
                    className="size-8 rounded-xl border border-border bg-card hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-primary flex items-center justify-center transition-all shadow-2xs cursor-pointer group/eye"
                  >
                    <Eye className="size-4 group-hover/eye:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UserRegisteredListings
