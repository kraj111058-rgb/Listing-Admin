import { useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin } from "lucide-react"
import { Modal } from "@/components/common/modal"
import { Button } from "@/components/ui/button"
import { InputWithLabel } from "@/components/common/InputWithLabel"
import { SelectWithLabel } from "@/components/common/SelectWithLabel"
import { citySchema, type CityFormValues } from "@/schemas/city.schema"
import { CityStatus } from "@/enums"
import {
  useStates,
  useCreateCity,
  useUpdateCity,
} from "@/hooks/queries"
import type { CityData } from "@/types"
import { cn, generateSlug } from "@/lib/utils"

interface CityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  city?: CityData | null
}

const CityModal = ({ open, onOpenChange, city }: CityModalProps) => {
  const isEditing = Boolean(city)

  const { data: states = [], isLoading: isStatesLoading } = useStates()
  const { mutate: createCity, isPending: isCreating } = useCreateCity()
  const { mutate: updateCity, isPending: isUpdating } = useUpdateCity()
  const isPending = isCreating || isUpdating

  const stateOptions = useMemo(
    () =>
      states.map((s) => ({
        value: s.id,
        label: `${s.name} (${s.code})`,
      })),
    [states]
  )

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      slug: "",
      state_id: "",
      state_code: "GJ",
      status: CityStatus.ACTIVE,
    },
  })

  // Populate form when editing or resetting
  useEffect(() => {
    if (city && open) {
      reset({
        name: city.name,
        slug: city.slug,
        state_id: city.state_id,
        state_code: city.state_code,
        status: city.status,
      })
    } else if (!city && open) {
      const gujaratState = states.find((s) => s.code === "GJ")
      reset({
        name: "",
        slug: "",
        state_id: gujaratState?.id || states[0]?.id || "",
        state_code: gujaratState?.code || states[0]?.code || "GJ",
        status: CityStatus.ACTIVE,
      })
    }
  }, [city, open, reset, states])

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  // Pure declarative mutation calls with zero try/catch
  const onSubmit = (data: CityFormValues) => {
    if (isEditing && city) {
      updateCity(
        { id: city.id, payload: data },
        { onSuccess: handleClose }
      )
    } else {
      createCity(data, { onSuccess: handleClose })
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen)
      }}
      onClose={handleClose}
      title={isEditing ? "Edit City" : "Add New City"}
      description={
        isEditing
          ? "Update city details, state assignment, and status."
          : "Add a new dynamic city under an Indian state for listings."
      }
      headerIcon={<MapPin className="size-4" />}
      maxWidth="sm:max-w-xl"
      asForm
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="font-semibold cursor-pointer"
          >
            <MapPin className="size-3.5" />
            {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add City"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Controller
          name="state_id"
          control={control}
          render={({ field }) => (
            <SelectWithLabel
              label="State / Union Territory"
              placeholder={
                isStatesLoading
                  ? "Loading Indian states..."
                  : "Select an Indian state or UT..."
              }
              options={stateOptions}
              value={field.value}
              onValueChange={(selectedStateId) => {
                field.onChange(selectedStateId)
                const matchedState = states.find((s) => s.id === selectedStateId)
                if (matchedState) {
                  setValue("state_code", matchedState.code, {
                    shouldValidate: true,
                  })
                }
              }}
              error={errors?.state_id?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputWithLabel
                label="City Name"
                placeholder="e.g., Ahmedabad"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e)
                  if (!isEditing) {
                    setValue("slug", generateSlug(e.target.value), {
                      shouldValidate: true,
                    })
                  }
                }}
                error={errors?.name?.message}
              />
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <InputWithLabel
                label="URL Slug"
                placeholder="e.g., ahmedabad"
                {...field}
                error={errors?.slug?.message}
              />
            )}
          />
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground">
                  City Status
                </span>
                <p className="text-[11px] text-muted-foreground">
                  {field.value === CityStatus.ACTIVE
                    ? "Active and visible on directory website"
                    : "Hidden from search & filters"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => field.onChange(CityStatus.ACTIVE)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                    field.value === CityStatus.ACTIVE
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {CityStatus.ACTIVE}
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(CityStatus.INACTIVE)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                    field.value === CityStatus.INACTIVE
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {CityStatus.INACTIVE}
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </Modal>
  )
}

export default CityModal
