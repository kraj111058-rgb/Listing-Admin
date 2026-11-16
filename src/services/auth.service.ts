import { UserRole, UserStatus } from "@/enums"
import { supabase, SUPABASE_CONSTANTS } from "@/lib/supabase"
import type { LoginFormValues } from "@/schemas"
import type { UserProfileResponse } from "@/types"

export const authService = {
  // 1. Email & Password Sign In + Admin Role Check
  login: async (credentials: LoginFormValues) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) throw new Error(error.message)
    if (!data.user) throw new Error("Unable to authenticate user.")

    // Verify role in public.users table
    const { data: profile, error: profileError } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError || !profile) {
      await authService.logout();
      throw new Error("User profile not found. Please contact system administrator.")
    }

    if (profile.role !== UserRole.ADMIN) {
      await authService.logout();
      throw new Error("Access denied. Only administrators can access this portal.")
    }

    if (profile.status === UserStatus.INACTIVE) {
      await authService.logout();
      throw new Error("Account is currently inactive. Please contact administrator.")
    }

    return {
      session: data.session,
      user: data.user,
      profile: profile as UserProfileResponse,
    }
  },

  // 2. Sign Out
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // 3. Get currently authenticated admin user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null

    const { data: profile } = await supabase
      .from(SUPABASE_CONSTANTS.DB_TABLES.USERS)
      .select("*")
      .eq("id", user.id)
      .single()

    return {
      ...user,
      profile: (profile as UserProfileResponse) || null,
    }
  },

  // 4. Get active session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return session;
  },
}
