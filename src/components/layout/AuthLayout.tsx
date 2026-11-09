import { Building } from "lucide-react"
import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-background">
      {/* Background radial gradient glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(0,0,0,0))] pointer-events-none"
      />

      {/* Main Container */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-10">

        {/* Brand Header Logo */}
        <div
          className="inline-flex items-center gap-3 group mb-6 text-left select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 leading-none">
              <span className="text-2xl font-black tracking-tight text-foreground">
                One
              </span>
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                Listy
              </span>
            </div>
            <span className="text-xs font-semibold text-muted-foreground tracking-wide">
              India&apos;s Premier Directory
            </span>
          </div>
        </div>

        {/* Floating Card: Outlet for Login Form */}
        <div className="w-full bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default AuthLayout
