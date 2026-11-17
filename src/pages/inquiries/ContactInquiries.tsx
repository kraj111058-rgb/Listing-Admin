import { useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import ContactInquiryStats from "@/components/features/contact-inquiries/ContactInquiryStats"
import ContactInquiriesTable from "@/components/features/contact-inquiries/ContactInquiriesTable"
import ContactInquiryModal from "@/components/features/contact-inquiries/ContactInquiryModal"
import { useUpdateContactInquiryStatus } from "@/hooks/queries"
import { ContactInquiryStatus } from "@/enums"
import type { ContactInquiryData } from "@/types"

const ContactInquiries = () => {
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { mutate: updateStatus } = useUpdateContactInquiryStatus()

  // Open modal
  const handleViewInquiry = (inquiry: ContactInquiryData) => {
    setSelectedInquiry(inquiry)
    setIsModalOpen(true)
  }

  // Handle status toggle (New <-> Replied / Archived)
  const handleToggleStatus = (
    inquiryId: string,
    status: ContactInquiryStatus
  ) => {
    updateStatus(
      { id: inquiryId, status },
      {
        onSuccess: (updated) => {
          if (selectedInquiry?.id === inquiryId) {
            setSelectedInquiry(updated)
          }
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Contact Inquiries"
        description="Review incoming contact messages and inquiries from the website."
      />

      {/* Stats Overview */}
      <ContactInquiryStats />

      {/* Inquiries Table */}
      <ContactInquiriesTable onViewInquiry={handleViewInquiry} />

      {/* Inquiry Detail Modal */}
      <ContactInquiryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        inquiry={selectedInquiry}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}

export default ContactInquiries
