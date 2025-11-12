"use client"

import * as React from "react"
import { addDays, format, isAfter, isBefore, startOfDay } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Calendar } from "@/registry/new-york-v4/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"

interface DateTimeRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The selected date range
   */
  selected?: DateRange
  /**
   * Callback when date range changes
   */
  onSelect?: (date: DateRange | undefined) => void
  /**
   * Callback when time changes
   */
  onTimeChange?: (timeFrom: string, timeTo: string) => void
  /**
   * Minimum date that can be selected
   */
  minDate?: Date
  /**
   * Maximum date that can be selected
   */
  maxDate?: Date
  /**
   * Preset date ranges
   */
  presets?: {\ label: string; value: DateRange }[]
  /**
   * Whether to show time inputs
   */
  showTime?: boolean
  /**
   * Date format for display
   */
  dateFormat?: string
  /**
   * Time format for display
   */
  timeFormat?: string
}

export function DateTimeRangePicker({
  className,
  selected: controlledSelected,
  onSelect: controlledOnSelect,
  onTimeChange,
  minDate,
  maxDate,
  presets = [
    { label: "Today", value: { from: startOfDay(new Date()), to: new Date() } },
    { label: "Yesterday", value: { from: startOfDay(addDays(new Date(), -1)), to: addDays(new Date(), -1) } },
    { label: "Last 7 days", value: { from: startOfDay(addDays(new Date(), -6)), to: new Date() } },
    { label: "Last 30 days", value: { from: startOfDay(addDays(new Date(), -29)), to: new Date() } },
    { label: "This month", value: { from: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), to: new Date() } },
    { label: "Last month", value: { from: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)), to: startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 0)) } },
  ],
  showTime = true,
  dateFormat = "yyyy-MM-dd",
  timeFormat = "HH:mm",
  ...props
}: DateTimeRangePickerProps) {
  // Local state if not controlled
  const [localSelected, setLocalSelected] = React.useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: new Date(),
  })
  const [localTimeFrom, setLocalTimeFrom] = React.useState("00:00")
  const [localTimeTo, setLocalTimeTo] = React.useState("23:59")

  // Determine if controlled or uncontrolled
  const isControlled = controlledSelected !== undefined
  const selected = isControlled ? controlledSelected : localSelected
  const setSelected = isControlled ? controlledOnSelect || (() => {}) : setLocalSelected

  // Handle date selection
  const handleSelect = (date: DateRange | undefined) => {
    setSelected(date)
  }

  // Handle time changes
  const handleTimeFromChange = (value: string) => {
    setLocalTimeFrom(value)
    onTimeChange?.(value, localTimeTo)
  }

  const handleTimeToChange = (value: string) => {
    setLocalTimeTo(value)
    onTimeChange?.(localTimeFrom, value)
  }

  // Handle preset selection
  const handlePresetSelect = (value: string) => {
    const preset = presets.find((p) => p.label === value)
    if (preset) {
      setSelected(preset.value)
    }
  }

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return ""
    return format(date, dateFormat)
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                value={formatDate(selected?.from)}
                placeholder="Start date"
                className="w-[140px]"
                readOnly
              />
              {showTime && (
                <>
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={localTimeFrom}
                    placeholder="00:00"
                    className="w-[80px]"
                    onChange={(e) => handleTimeFromChange(e.target.value)}
                  />
                </>
              )}
            </div>
            <span className="flex items-center text-muted-foreground">-</span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                value={formatDate(selected?.to)}
                placeholder="End date"
                className="w-[140px]"
                readOnly
              />
              {showTime && (
                <>
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <Input
                    value={localTimeTo}
                    placeholder="23:59"
                    className="w-[80px]"
                    onChange={(e) => handleTimeToChange(e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Presets */}
          {presets.length > 0 && (
            <div className="p-2 border-b">
              <Select onValueChange={handlePresetSelect} defaultValue={presets[0].label}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.label} value={preset.label}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Calendar */}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selected?.from}
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={2}
            minDate={minDate}
            maxDate={maxDate}
            disabled={(date) => {
              if (minDate && isBefore(date, minDate)) return true
              if (maxDate && isAfter(date, maxDate)) return true
              return false
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateTimeRangePicker