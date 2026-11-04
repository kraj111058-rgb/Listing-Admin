import { UserAvatar } from "@/components/common"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockListings, type ListingItem, type ListingStatus } from "@/data/dummyData"
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  ExternalLink,
  Eye,
  FileCheck2,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Tag,
  Users,
  XCircle
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find listing by ID or fallback to first listing
  const initialListing = mockListings.find((l) => l.id === id) || mockListings[0]
  const [listing] = useState<ListingItem>(initialListing)
  const [activeTab, setActiveTab] = useState("basic")
  const [copiedSlug, setCopiedSlug] = useState(false)

  const handleCopySlug = () => {
    if (listing.slug) {
      navigator.clipboard.writeText(listing.slug)
      setCopiedSlug(true)
      setTimeout(() => setCopiedSlug(false), 2000)
    }
  }

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="success" className="rounded-full px-2.5 py-0.75 gap-1 text-xs font-semibold">
            <CheckCircle2 className="size-3.5!" />
            Approved
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="warning" className="rounded-full px-2.5 py-0.75 gap-1 text-xs font-semibold">
            <Clock className="size-3.5!" />
            Pending
          </Badge>
        )
      case "Rejected":
        return (
          <Badge variant="danger" className="rounded-full px-2.5 py-0.75 gap-1 text-xs font-semibold">
            <XCircle className="size-3.5!" />
            Rejected
          </Badge>
        )
    }
  }

  const galleryPhotos = listing.gallery || []
  const listingTags = listing.tags || ["business", "services", listing.city.toLowerCase()]

  return (
    <div className="space-y-6">
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("/listings")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer w-fit group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Listings
        </button>
      </div>

      {/* 2. Executive Listing Header Card */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
            {/* Business Logo / Thumbnail */}
            {listing.logo ? (
              <img
                src={listing.logo}
                alt={listing.name}
                className="size-14 sm:size-18 rounded-2xl object-cover border border-border shrink-0 shadow-xs"
              />
            ) : (
              <div className="size-14 sm:size-18 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
                <Building2 className="size-7 sm:size-9" />
              </div>
            )}

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground break-words">
                  {listing.name}
                </h1>
                {listing.status === "Approved" && (
                  <span title="Approved Business" className="text-primary inline-flex items-center">
                    <ShieldCheck className="size-4.5 sm:size-5 fill-primary/20 text-primary" />
                  </span>
                )}
                {listing.plan && listing.plan !== "Free" && (
                  <Badge variant="warning" className="gap-1 font-semibold text-[10px] sm:text-[11px] px-2 py-0.5">
                    <Crown className="size-3 text-amber-600" />
                    {listing.plan}
                  </Badge>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-3xl leading-relaxed break-words">
                {listing.shortDescription || `Approved business profile registered under ${listing.category} directory.`}
              </p>
            </div>
          </div>

          {/* Quick Status Pill */}
          <div className="flex items-center gap-2 flex-wrap shrink-0 self-start sm:self-auto">
            {getStatusBadge(listing.status)}
          </div>
        </div>

        {/* Quick Overview Meta Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3.5 mt-4 border-t border-border text-xs">
          <Badge variant="secondary" className="font-semibold px-2.5 py-0.5">
            {listing.category}
          </Badge>

          <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate max-w-[200px]">{listing.city}, {listing.state}</span>
          </span>

          <span className="inline-flex items-center gap-1 font-bold text-amber-500">
            <Star className="size-3.5 fill-amber-500 text-amber-500 shrink-0" />
            {listing.rating}
            <span className="text-muted-foreground font-normal">({listing.reviews} reviews)</span>
          </span>

          <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
            <Calendar className="size-3.5 text-muted-foreground/70 shrink-0" />
            Est. {listing.established || "2018"}
          </span>

          <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
            <Clock className="size-3.5 text-muted-foreground/70 shrink-0" />
            <span className="truncate">{listing.is24x7 ? "Open 24x7" : `${listing.openTime || "09:00 AM"} - ${listing.closeTime || "09:00 PM"}`}</span>
          </span>
        </div>
      </div>

      {/* Rejection Notice Banner (If Rejected) */}
      {listing.status === "Rejected" && listing.rejectionReason && (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 sm:p-5 text-xs flex items-start gap-3.5 shadow-2xs">
          <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-destructive text-sm">Listing Rejected by Admin</h4>
            <p className="text-foreground/90 leading-relaxed font-medium">
              <span className="font-semibold text-muted-foreground">Reason: </span>
              {listing.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* 3. Main 2-Column Responsive Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sidebar Details (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:block lg:space-y-6">
          {/* Owner & Account Information */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Listing Owner
              </span>
              <Link
                to={`/users/${listing.ownerId}`}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Profile <ExternalLink className="size-3" />
              </Link>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <UserAvatar name={listing.ownerName} className="size-11 shadow-xs shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {listing.ownerName}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium truncate">
                    {listing.ownerEmail}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                    <Mail className="size-3.5 text-muted-foreground/70" /> Email
                  </span>
                  <a
                    href={`mailto:${listing.ownerEmail}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors truncate text-right flex-1 min-w-0"
                  >
                    {listing.ownerEmail}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                    <Phone className="size-3.5 text-muted-foreground/70" /> Phone
                  </span>
                  <a
                    href={`tel:${listing.ownerPhone}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors truncate text-right flex-1 min-w-0"
                  >
                    {listing.ownerPhone}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                    <Calendar className="size-3.5 text-muted-foreground/70" /> Submitted
                  </span>
                  <span className="font-medium text-foreground shrink-0">
                    {listing.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Plan Card */}
          <div className="rounded-2xl border border-border bg-card shadow-xs p-5 space-y-3.5">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Portal Visibility & Package
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/10 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                  <Eye className="size-3" /> Total Views
                </span>
                <span className="font-bold text-foreground text-sm block">
                  {listing.views ? listing.views.toLocaleString() : "2,450"}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/10 space-y-1">
                <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                  <Crown className="size-3 text-amber-500" /> Plan Type
                </span>
                <span className="font-bold text-foreground text-sm block">
                  {listing.plan || "Featured"}
                </span>
              </div>
            </div>

            {/* Visibility Switch status */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10 text-xs">
              <span className="font-semibold text-foreground">Directory Visibility</span>
              <Badge variant={listing.isActive !== false ? "success" : "secondary"} className="text-[11px]">
                {listing.isActive !== false ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Detailed Inspection matching 5-Step Wizard (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            {/* Elegant Segmented Navigation Bar */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="p-2.5 sm:p-3 border-b border-border bg-muted/20 overflow-x-auto no-scrollbar">
                <TabsList className="h-9 p-1 bg-muted/40 border border-border rounded-lg gap-1 inline-flex w-max min-w-full sm:min-w-0">
                  <TabsTrigger
                    value="basic"
                    className="h-7 px-3 sm:px-3.5 text-xs font-semibold rounded-md shrink-0"
                  >
                    Basic Info
                  </TabsTrigger>

                  <TabsTrigger
                    value="location"
                    className="h-7 px-3 sm:px-3.5 text-xs font-semibold rounded-md shrink-0"
                  >
                    Location & Timings
                  </TabsTrigger>

                  <TabsTrigger
                    value="media"
                    className="h-7 px-3 sm:px-3.5 text-xs font-semibold rounded-md shrink-0"
                  >
                    Photos & Social
                  </TabsTrigger>

                  <TabsTrigger
                    value="seo"
                    className="h-7 px-3 sm:px-3.5 text-xs font-semibold rounded-md shrink-0"
                  >
                    SEO Details
                  </TabsTrigger>

                  <TabsTrigger
                    value="plan"
                    className="h-7 px-3 sm:px-3.5 text-xs font-semibold rounded-md shrink-0"
                  >
                    Plan & Offerings
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-4 sm:p-6">
                {/* ========================================================= */}
                {/* TAB 1: Step 1 Basic Information */}
                {/* ========================================================= */}
                <TabsContent value="basic" className="mt-0 space-y-6">
                  {/* Structured Basic Profile Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Business Identity & Registration
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 text-xs">
                      {/* Business Name */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground block text-[11px]">Business Legal Name</span>
                        <span className="font-bold text-foreground text-sm block break-words">
                          {listing.name}
                        </span>
                      </div>

                      {/* Slug with Copy */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground block text-[11px]">Slug (URL Identifier)</span>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <code className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded truncate flex-1 min-w-0">
                            /{listing.slug || listing.id.toLowerCase()}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopySlug}
                            className="text-muted-foreground hover:text-foreground text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Copy className="size-3" />
                            <span>{copiedSlug ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground block text-[11px]">Category</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-foreground text-sm">
                            {listing.category}
                          </span>
                        </div>
                      </div>

                      {/* Established Year */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground block text-[11px]">Year Established</span>
                        <span className="font-bold text-foreground text-sm block">
                          {listing.established || "2018"}
                        </span>
                      </div>

                      {/* Employees Range */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground block text-[11px] flex items-center gap-1">
                          <Users className="size-3 text-muted-foreground/70" /> No. of Employees
                        </span>
                        <span className="font-bold text-foreground text-sm block">
                          {listing.employees || "21-50 Employees"}
                        </span>
                      </div>

                      {/* GSTIN */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground block text-[11px] flex items-center gap-1">
                          <FileCheck2 className="size-3 text-muted-foreground/70" /> GSTIN Number
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground text-sm truncate flex-1 min-w-0">
                            {listing.gstin || "27AAACG1234F1Z8"}
                          </span>
                          <Badge variant="success" className="text-[10px] py-0 px-1.5 shrink-0">
                            Valid Format
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keywords / Tags */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="size-3.5 text-primary" /> Keywords / Tags ({listingTags.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {listingTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Short Description Callout */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Short Description (1-Line Summary)
                    </h4>
                    <p className="text-sm font-medium text-foreground p-3.5 rounded-xl border border-border bg-muted/15 leading-relaxed break-words">
                      {listing.shortDescription || "No short description provided."}
                    </p>
                  </div>

                  {/* Full Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Full Business Description
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed p-4 rounded-xl border border-border bg-card whitespace-pre-line break-words">
                      {listing.fullDescription || "No full description provided."}
                    </p>
                  </div>
                </TabsContent>

                {/* ========================================================= */}
                {/* TAB 2: Step 2 Location, Contact & Timings */}
                {/* ========================================================= */}
                <TabsContent value="location" className="mt-0 space-y-6">
                  {/* Physical Street Address */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" /> Physical Address
                      </h4>
                      {listing.latitude && listing.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Navigation className="size-3" /> Verify Coordinates on Google Maps
                        </a>
                      ) : (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            `${listing.name}, ${listing.address}, ${listing.city}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Navigation className="size-3" /> View Address on Google Maps
                        </a>
                      )}
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px] mb-0.5">Full Street Address:</span>
                        <p className="text-sm font-semibold text-foreground break-words">
                          {listing.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2.5 border-t border-border/60">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">State</span>
                          <span className="font-bold text-foreground text-sm block truncate">{listing.state}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">City</span>
                          <span className="font-bold text-foreground text-sm block truncate">{listing.city}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Pincode</span>
                          <span className="font-bold font-mono text-foreground text-sm block truncate">
                            {listing.pincode || "400001"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">GPS Coordinates</span>
                          <span className="font-bold font-mono text-foreground text-xs block truncate" title={`${listing.latitude || "18.9217"}, ${listing.longitude || "72.8332"}`}>
                            {listing.latitude || "18.9217"}, {listing.longitude || "72.8332"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Communication & Digital Channels */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Communication & Contact Channels
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 text-xs">
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                          <Phone className="size-3.5 text-primary" /> Primary Phone
                        </span>
                        <a
                          href={`tel:${listing.phone}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {listing.phone}
                        </a>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                          <Phone className="size-3.5 text-muted-foreground/70" /> Secondary Phone
                        </span>
                        <span className="font-bold text-sm text-foreground block truncate">
                          {listing.secondaryPhone || "Not Provided"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                          <Mail className="size-3.5 text-primary" /> Official Email
                        </span>
                        <a
                          href={`mailto:${listing.email}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {listing.email}
                        </a>
                      </div>

                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                          <Globe className="size-3.5 text-primary" /> Web Portal
                        </span>
                        {listing.website ? (
                          <a
                            href={listing.website}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-sm text-primary hover:underline flex items-center gap-1 truncate"
                          >
                            {listing.website.replace(/^https?:\/\//, "")}
                            <ExternalLink className="size-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm block">Not Provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Business Timing & Hours */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" /> Business Operating Schedule
                      </h4>
                      <Badge variant={listing.is24x7 ? "success" : "outline"} className="text-xs font-semibold px-2.5 py-0.5 w-fit">
                        {listing.is24x7 ? "Open 24x7" : `Daily: ${listing.openTime || "09:00 AM"} - ${listing.closeTime || "09:00 PM"}`}
                      </Badge>
                    </div>

                    {/* Weekly Off Days if any */}
                    {listing.closedDays && listing.closedDays.length > 0 && (
                      <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-xs flex flex-wrap items-center gap-2">
                        <span className="font-bold text-amber-800 dark:text-amber-400 shrink-0">Weekly Off:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {listing.closedDays.map((day) => (
                            <Badge key={day} variant="danger" className="text-[10px] px-2 py-0">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Day Schedule Table */}
                    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
                      {DAYS_OF_WEEK.map((day) => {
                        const isClosed = !listing.is24x7 && (listing.closedDays || []).includes(day)
                        return (
                          <div
                            key={day}
                            className="px-3.5 sm:px-4 py-2.5 flex items-center justify-between text-xs hover:bg-muted/20 transition-colors gap-2"
                          >
                            <span className="font-bold text-foreground shrink-0">
                              {day}
                            </span>
                            {isClosed ? (
                              <Badge variant="danger" className="text-[10px] rounded-full shrink-0">
                                Closed
                              </Badge>
                            ) : (
                              <span className="font-semibold text-muted-foreground font-mono text-xs truncate text-right">
                                {listing.is24x7
                                  ? "Open 24x7"
                                  : `${listing.openTime || "09:00 AM"} - ${listing.closeTime || "09:00 PM"}`}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>

                {/* ========================================================= */}
                {/* TAB 3: Step 3 Photos & Social Media Links */}
                {/* ========================================================= */}
                <TabsContent value="media" className="mt-0 space-y-6">
                  {/* Cover Image Showcase */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="size-3.5 text-primary" /> Primary Cover Image
                    </h4>
                    {listing.logo ? (
                      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-border h-44 sm:h-56 bg-muted/20">
                        <img
                          src={listing.logo}
                          alt={listing.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="p-8 rounded-xl sm:rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
                        No cover image uploaded.
                      </div>
                    )}
                  </div>

                  {/* Photo Gallery (Max 5 Images) */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="size-3.5 text-primary" /> Photo Gallery ({galleryPhotos.length} Photos)
                    </h4>
                    {galleryPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                        {galleryPhotos.map((url, idx) => (
                          <div
                            key={idx}
                            className="aspect-video rounded-xl overflow-hidden border border-border bg-muted/20 relative group shadow-2xs"
                          >
                            <img
                              src={url}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-white text-xs font-semibold bg-black/60 px-2.5 py-1 rounded-lg flex items-center gap-1"
                              >
                                View <ExternalLink className="size-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl sm:rounded-2xl border border-dashed border-border text-center text-xs text-muted-foreground">
                        No gallery photos submitted.
                      </div>
                    )}
                  </div>

                  {/* Social Media Links Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Social Media Channels
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* WhatsApp */}
                      <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MessageCircle className="size-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground block">WhatsApp</span>
                            <span className="font-bold text-foreground text-xs truncate block">
                              {listing.whatsapp || listing.phone}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://wa.me/${(listing.whatsapp || listing.phone).replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted/50 shrink-0"
                          title="View on WhatsApp"
                        >
                          <Eye className="size-4" />
                        </a>
                      </div>

                      {/* Facebook */}
                      <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="size-4 text-blue-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground block">Facebook</span>
                            <span className="font-bold text-foreground text-xs truncate block">
                              {listing.facebook || "Not Linked"}
                            </span>
                          </div>
                        </div>
                        {listing.facebook && (
                          <a
                            href={listing.facebook}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted/50 shrink-0"
                            title="View Facebook"
                          >
                            <Eye className="size-4" />
                          </a>
                        )}
                      </div>

                      {/* Instagram */}
                      <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="size-4 text-pink-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground block">Instagram</span>
                            <span className="font-bold text-foreground text-xs truncate block">
                              {listing.instagram || "Not Linked"}
                            </span>
                          </div>
                        </div>
                        {listing.instagram && (
                          <a
                            href={listing.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted/50 shrink-0"
                            title="View Instagram"
                          >
                            <Eye className="size-4" />
                          </a>
                        )}
                      </div>

                      {/* Twitter / X */}
                      <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="size-4 text-slate-800 dark:text-slate-200 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground block">Twitter / X</span>
                            <span className="font-bold text-foreground text-xs truncate block">
                              {listing.twitter || "Not Linked"}
                            </span>
                          </div>
                        </div>
                        {listing.twitter && (
                          <a
                            href={listing.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted/50 shrink-0"
                            title="View Twitter"
                          >
                            <Eye className="size-4" />
                          </a>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="size-4 text-sky-700 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground block">LinkedIn</span>
                            <span className="font-bold text-foreground text-xs truncate block">
                              {listing.linkedin || "Not Linked"}
                            </span>
                          </div>
                        </div>
                        {listing.linkedin && (
                          <a
                            href={listing.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted/50 shrink-0"
                            title="View LinkedIn"
                          >
                            <Eye className="size-4" />
                          </a>
                        )}
                      </div>

                      {/* YouTube */}
                      <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="size-4 text-rose-600 shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[11px] text-muted-foreground block">YouTube</span>
                            <span className="font-bold text-foreground text-xs truncate block">
                              {listing.youtube || "Not Linked"}
                            </span>
                          </div>
                        </div>
                        {listing.youtube && (
                          <a
                            href={listing.youtube}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted/50 shrink-0"
                            title="View YouTube"
                          >
                            <Eye className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* ========================================================= */}
                {/* TAB 4: Step 4 SEO Details */}
                {/* ========================================================= */}
                <TabsContent value="seo" className="mt-0 space-y-6">
                  {/* Google SERP Snippet Simulator */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="size-3.5 text-primary" /> Google SERP Snippet Preview
                    </h4>
                    <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-card space-y-1 shadow-2xs font-sans overflow-hidden">
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-mono truncate block">
                        https://indianlistingbucket.com/listings/{listing.slug || listing.id.toLowerCase()}
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-blue-600 hover:underline cursor-pointer truncate block">
                        {listing.metaTitle || `${listing.name} | Verified Directory`}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed break-words">
                        {listing.metaDescription || listing.shortDescription || listing.fullDescription}
                      </p>
                    </div>
                  </div>

                  {/* Meta Details Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Meta Tags Configuration
                    </h4>

                    <div className="space-y-3.5 text-xs">
                      {/* Meta Title */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-semibold">Meta Title</span>
                          <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                            {(listing.metaTitle || listing.name).length}/60 chars
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground break-words">
                          {listing.metaTitle || `${listing.name} | Verified Business`}
                        </p>
                      </div>

                      {/* Meta Description */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-semibold">Meta Description</span>
                          <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                            {(listing.metaDescription || listing.shortDescription || "").length}/160 chars
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground leading-relaxed break-words">
                          {listing.metaDescription || listing.shortDescription || "No meta description provided."}
                        </p>
                      </div>

                      {/* Meta Keywords */}
                      <div className="p-3.5 rounded-xl border border-border bg-card space-y-1.5">
                        <span className="text-muted-foreground font-semibold block">Meta Keywords</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(listing.metaKeywords || listingTags.join(", "))
                            .split(",")
                            .map((kw, i) => (
                              <Badge key={i} variant="secondary" className="text-[11px] font-medium">
                                {kw.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* ========================================================= */}
                {/* TAB 5: Step 5 Choose Plan & Offerings */}
                {/* ========================================================= */}
                <TabsContent value="plan" className="mt-0 space-y-6">
                  {/* Selected Package Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Crown className="size-5 text-amber-500 shrink-0" />
                        <h4 className="text-base font-bold text-foreground">
                          {listing.plan || "Featured Business Package"}
                        </h4>
                        <Badge variant="info" className="text-[10px] font-bold">
                          ACTIVE PLAN
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Includes premium directory listing, search boost, verified badge, and catalog management.
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-muted-foreground block">Plan Tier</span>
                      <span className="text-lg font-extrabold text-primary">
                        {listing.plan || "Free"}
                      </span>
                    </div>
                  </div>

                  {/* Connected Catalog Offerings */}
                  <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <h5 className="font-bold text-foreground">
                        Catalog Services & Products
                      </h5>
                      <p className="text-muted-foreground mt-0.5">
                        Manage inventory items and special offers linked to this listing.
                      </p>
                    </div>

                    <Link to="/services-products" className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto font-semibold text-xs cursor-pointer gap-1 justify-center">
                        Go to Services & Products <ExternalLink className="size-3" />
                      </Button>
                    </Link>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetails