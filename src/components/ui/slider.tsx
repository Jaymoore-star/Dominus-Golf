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
    return 1
  }, [value, defaultValue])

  return (
    <SliderPrimitive.Root
      className={cn("w-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      {...props}
    >
      <SliderPrimitive.Control className="slider-control relative flex w-full items-center select-none py-2">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="slider-track relative grow w-full rounded-full"
          style={{ height: '4px', backgroundColor: '#D9D9D9' }}
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
            className="slider-thumb"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
