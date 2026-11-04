import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AdminLayout from "@/components/layout/AdminLayout"
import AuthLayout from "@/components/layout/AuthLayout"
import Login from "@/pages/login/Login"
import Category from "@/pages/category/Category"
import CategoryForm from "@/pages/category/CategoryForm"
import Dashboard from "@/pages/dashboard/Dashboard"
import Listings from "@/pages/listings/Listings"
import ListingDetails from "@/pages/listings/ListingDetails"
import NotFound from "@/pages/not-found/NotFound"
import Settings from "@/pages/settings/Settings"
import Users from "@/pages/users/Users"
import UserDetails from "@/pages/users/UserDetails"
import ContactInquiries from "./pages/inquiries/ContactInquiries"
import BannerAdsInquiries from "./pages/inquiries/BannerAdsInquiries"
import ServicesProductsInquiries from "./pages/inquiries/ServicesProductsInquiries"
import Subscriptions from "@/pages/subscriptions/Subscriptions"
import Notifications from "@/pages/notifications/Notifications"
import Payments from "@/pages/payments/Payments"
import StatesCity from "@/pages/locations/StatesCity"
import ServicesProducts from "@/pages/services-products/ServicesProducts"
import Advertisements from "@/pages/advertisements/Advertisements"
import Blog from "@/pages/blog/Blog"
import BlogForm from "@/pages/blog/BlogForm"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/categories/create" element={<CategoryForm />} />
          <Route path="/categories/:id/edit" element={<CategoryForm />} />
          <Route path="/states-city" element={<StatesCity />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/services-products" element={<ServicesProducts />} />
          <Route path="/inquiries" element={<Navigate to="/inquiries/contact" replace />} />
          <Route path="/inquiries/contact" element={<ContactInquiries />} />
          <Route path="/inquiries/banner-ads" element={<BannerAdsInquiries />} />
          <Route path="/inquiries/services-products" element={<ServicesProductsInquiries />} />
          <Route path="/advertisements" element={<Advertisements />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/create" element={<BlogForm />} />
          <Route path="/blog/:id/edit" element={<BlogForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;