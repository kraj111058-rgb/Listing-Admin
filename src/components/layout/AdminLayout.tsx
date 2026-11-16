import { useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useCurrentUser } from "@/hooks/queries/useAuth"
import { Loader } from "@/components/common"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { UserRole, UserStatus } from "@/enums"

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loader />
  }

  if (!user || user.profile?.role !== UserRole.ADMIN || user.profile?.status === UserStatus.INACTIVE) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 

export default AdminLayout
