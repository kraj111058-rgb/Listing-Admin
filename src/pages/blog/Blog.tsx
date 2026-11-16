import { PageHeader } from "@/components/common/PageHeader"
import BlogCategoryModal from "@/components/features/blog/BlogCategoryModal"
import BlogCategoryTable from "@/components/features/blog/BlogCategoryTable"
import BlogStats from "@/components/features/blog/BlogStats"
import BlogTable from "@/components/features/blog/BlogTable"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BlogCategoryData } from "@/types"
import { FileText, FolderPlus, FolderTree, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Blog = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"blogs" | "categories">("blogs")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategoryData | null>(null);

  const handleOpenAddCategory = () => {
    setEditingCategory(null)
    setIsCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: BlogCategoryData) => {
    setEditingCategory(cat)
    setIsCategoryModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Add Category & Add Blog Action Buttons */}
      <PageHeader
        title="Blogs"
        description="Publish, edit, and manage blog posts, categories, and announcements."
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenAddCategory}
            className="h-9 gap-1.5 px-3.5 text-xs font-semibold cursor-pointer"
          >
            <FolderPlus className="size-4" />
            <span>Add Category</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => navigate("/blog/create")}
            className="h-9 gap-1.5 px-3.5 text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Blog</span>
          </Button>
        </div>
      </PageHeader>

      {/* 2. Stats Overview */}
      <BlogStats />

      {/* 3. View Switcher Tabs: Blogs & Category */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "blogs" | "categories")}
        className="space-y-6"
      >
        <div className="flex items-center justify-between mb-1.5">
          <TabsList className="h-9.5 p-1 bg-muted/40 border border-border rounded-lg gap-1">
            <TabsTrigger
              value="blogs"
              className="h-7.5 px-3.5 text-xs font-semibold rounded-lg gap-1.5"
            >
              <FileText className="size-3.75" />
              <span>Blogs</span>
            </TabsTrigger>

            <TabsTrigger
              value="categories"
              className="h-7.5 px-3.5 text-xs font-semibold rounded-lg gap-1.5"
            >
              <FolderTree className="size-3.75" />
              <span>Category</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 4. Active Tab Content */}
        <TabsContent value="blogs">
          <BlogTable />
        </TabsContent>

        <TabsContent value="categories">
          <BlogCategoryTable onEditCategory={handleOpenEditCategory} />
        </TabsContent>
      </Tabs>

      {/* Category Create/Edit Modal with Zod validation */}
      <BlogCategoryModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        category={editingCategory}
      />
    </div>
  )
}

export default Blog
