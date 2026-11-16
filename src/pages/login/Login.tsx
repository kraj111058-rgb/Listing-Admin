import { InputWithLabel, Loader } from "@/components/common"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/hooks/queries/useAuth"
import { loginSchema, type LoginFormValues } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

const Login = () => {
  const { mutate: login, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: () => {
        reset();
      }
    });
  }

  return (
    <>
      {/* Form Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Sign In
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your credentials to access the admin portal.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputWithLabel
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              {...field}
              error={errors.email?.message}
              disabled={isPending}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <InputWithLabel
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              {...field}
              error={errors.password?.message}
              disabled={isPending}
              rightElement={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-foreground size-8 p-0 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              }
            />
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-7"
        >
          {isPending ? (
            <>
              <Loader inline size="sm" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </>
  )
}

export default Login
