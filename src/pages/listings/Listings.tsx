import { PageHeader } from "@/components/common/PageHeader"
import { mockListings } from "@/data/dummyData"
import ListingsStats from "@/components/features/listings/ListingsStats"
import ListingsTable from "@/components/features/listings/ListingsTable"

const Listings = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Listings Management"
        description="Review, verify, moderate, and manage registered business profiles across the platform."
      />

      <ListingsStats items={mockListings} />

      <ListingsTable items={mockListings} />
    </div>
  )
}

export default Listings
