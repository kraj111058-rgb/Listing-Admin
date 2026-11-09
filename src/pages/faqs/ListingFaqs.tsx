import { useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { mockListingFaqs, type ListingFaqAdminItem } from "@/data/dummyData"
import FaqStatsCards from "@/components/features/faqs/FaqStatsCards"
import ListingFaqsTable from "@/components/features/faqs/ListingFaqsTable"

const ListingFaqs = () => {
  const [faqs, setFaqs] = useState<ListingFaqAdminItem[]>(mockListingFaqs)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom FAQs"
        description="Review, approve, and manage custom frequently asked questions submitted by business owners for their listings."
      />

      {/* Stats Overview */}
      <FaqStatsCards faqs={faqs} />

      {/* FAQs Data Table & Actions */}
      <ListingFaqsTable items={faqs} onItemsChange={setFaqs} />
    </div>
  )
}

export default ListingFaqs

