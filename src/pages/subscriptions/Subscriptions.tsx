import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import type { SubscriptionPlanData } from "@/types"
import SubscriptionPlansTable from "@/components/features/subscriptions/SubscriptionPlansTable"
import SubscriptionPlanModal from "@/components/features/subscriptions/SubscriptionPlanModal"

const Subscriptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanData | null>(null)

  const handleOpenCreatePlan = () => {
    setEditingPlan(null)
    setIsModalOpen(true)
  }

  const handleOpenEditPlan = (plan: SubscriptionPlanData) => {
    setEditingPlan(plan)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Action Button */}
      <PageHeader
        title="Subscription Plans"
        description="Manage pricing packages, membership tiers, and directory advertising benefits."
      >
        <Button
          type="button"
          size="sm"
          onClick={handleOpenCreatePlan}
          className="h-9 gap-1.5 px-3.5 text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Create Plan</span>
        </Button>
      </PageHeader>

      {/* Subscription Plans Table */}
      <SubscriptionPlansTable onEditPlan={handleOpenEditPlan} />

      {/* Create / Edit Plan Modal */}
      <SubscriptionPlanModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        plan={editingPlan}
      />
    </div>
  )
}

export default Subscriptions
