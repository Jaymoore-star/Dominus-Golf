import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const thumbCount = React.useMemo(() => {
    if (Array.isArray(value)) return value.length
    if (Array.isArray(defaultValue)) return defaultValue.length
    // Single value mode (number) = 1 thumb
    return 1
  }, [value, defaultValue])

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow rounded-full select-none h-2 w-full cursor-pointer"
          style={{ backgroundColor: '#D9D9D9' }}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="h-full w-full rounded-full"
            style={{ backgroundColor: '#1A1A1A' }}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative z-10 block size-5 shrink-0 rounded-full bg-black shadow-md select-none cursor-grab active:cursor-grabbing hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden active:ring-4 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }