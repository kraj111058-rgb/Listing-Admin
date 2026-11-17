import { useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import {
  mockContactInquiries,
  type ContactInquiryItem,
} from "@/data/dummyData"
import ContactInquiryStats from "@/components/features/contact-inquiries/ContactInquiryStats"
import ContactInquiriesTable from "@/components/features/contact-inquiries/ContactInquiriesTable"
import ContactInquiryModal from "@/components/features/contact-inquiries/ContactInquiryModal"

const ContactInquiries = () => {
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>(mockContactInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Open modal
  const handleViewInquiry = (inquiry: ContactInquiryItem) => {
    setSelectedInquiry(inquiry)
    setIsModalOpen(true)
  }

  // Handle status toggle (New / Replied / Archived)
  const handleToggleStatus = (
    inquiryId: string,
    status: ContactInquiryItem["status"]
  ) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === inquiryId ? { ...item, status } : item
      )
    )
    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status } : null))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Contact Inquiries"
        description="Review incoming contact messages and inquiries from the website."
      />

      {/* Stats Overview */}
      <ContactInquiryStats inquiries={inquiries} />

      {/* Inquiries Table */}
      <ContactInquiriesTable
        inquiries={inquiries}
        onInquiriesChange={setInquiries}
        onViewInquiry={handleViewInquiry}
      />

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
