import { cn } from "@/lib/utils"

interface SliderProps {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => void
  onValueCommitted?: (value: number) => void
  className?: string
}

function Slider({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  value,
  onValueChange,
  onValueCommitted,
  className,
}: SliderProps) {
  const currentValue = value ?? defaultValue ?? min

  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div className={cn("relative w-full flex items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(e) => {
          const v = Number(e.target.value)
          onValueChange?.(v)
        }}
        onMouseUp={(e) => {
          const v = Number((e.target as HTMLInputElement).value)
          onValueCommitted?.(v)
        }}
        onTouchEnd={(e) => {
          const v = Number((e.target as HTMLInputElement).value)
          onValueCommitted?.(v)
        }}
        className="slider-native"
        style={{
          background: `linear-gradient(to right, #1A1A1A ${percentage}%, #D9D9D9 ${percentage}%)`,
        }}
      />
    </div>
  )
}

export { Slider }
