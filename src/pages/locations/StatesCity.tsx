import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import LocationStats from "@/components/features/locations/LocationStats"
import CitiesTable from "@/components/features/locations/CitiesTable"
import CityModal from "@/components/features/locations/CityModal"
import type { CityData } from "@/types"

const StatesCity = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<CityData | null>(null)

  const handleOpenAddModal = () => {
    setEditingCity(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (city: CityData) => {
    setEditingCity(city)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="States & City"
        description="Manage all 36 Indian states & union territories, and dynamically configure active cities for local directory listings."
      >
        <Button
          size="sm"
          onClick={handleOpenAddModal}
          className="h-9 gap-1.5 px-3.5 text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="size-4" />
          Add City
        </Button>
      </PageHeader>

      {/* Stats Cards */}
      <LocationStats />

      {/* Filterable Cities Table */}
      <CitiesTable onEditCity={handleOpenEditModal} />

      {/* Add / Edit City Modal */}
      <CityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        city={editingCity}
      />
    </div>
  )
}

export default StatesCity
