import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import CategoryStats from "@/components/features/category/CategoryStats"
import CategoriesTable from "@/components/features/category/CategoriesTable"

const Category = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize and manage business directory categories, images, and listings."
      >
        <Button
          size="sm"
          onClick={() => navigate("/categories/create")}
          className="h-9 gap-1.5 px-3.5 text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Plus className="size-4" />
          Add Category
        </Button>
      </PageHeader>

      <CategoryStats />
      <CategoriesTable />
    </div>
  )
}

export default Category