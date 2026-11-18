import { PageHeader } from "@/components/common/PageHeader"
import BannerAdsInquiriesTable from "@/components/features/banner-ads-inquiries/BannerAdsInquiriesTable"

const BannerAdsInquiries = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Ads Inquiries"
        description="Review incoming banner placement requests, contact advertisers, and confirm ad slots."
      />

      <BannerAdsInquiriesTable />
    </div>
  )
}

export default BannerAdsInquiries
