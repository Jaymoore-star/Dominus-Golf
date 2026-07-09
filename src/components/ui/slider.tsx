import { useRef, useCallback, useEffect } from "react"
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
  const inputRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)
  const currentValue = value ?? defaultValue ?? min

  const updateGradient = useCallback((val: number) => {
    if (!inputRef.current) return
    const pct = ((val - min) / (max - min)) * 100
    inputRef.current.style.background =
      `linear-gradient(to right, #1A1A1A ${pct}%, #D9D9D9 ${pct}%)`
  }, [min, max])

  // Initial gradient
  useEffect(() => {
    updateGradient(currentValue)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external changes (preset buttons) — skip during drag
  useEffect(() => {
    if (inputRef.current && !isDragging.current) {
      inputRef.current.value = String(currentValue)
      updateGradient(currentValue)
    }
  }, [currentValue, updateGradient])

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const v = Number((e.target as HTMLInputElement).value)
    updateGradient(v)
    onValueChange?.(v)
  }, [onValueChange, updateGradient])

  const handlePointerDown = useCallback(() => {
    isDragging.current = true
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLInputElement>) => {
    isDragging.current = false
    const v = Number((e.target as HTMLInputElement).value)
    updateGradient(v)
    onValueCommitted?.(v)
  }, [onValueCommitted, updateGradient])

  return (
    <div className={cn("relative w-full flex items-center", className)}>
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={currentValue}
        onInput={handleInput}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="slider-native"
      />
    </div>
  )
}

export { Slider }
