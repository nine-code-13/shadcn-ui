"use client"

import * as React from "react"
import { format } from "date-fns"
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

export default function DateTimeRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  })
  const [timeFrom, setTimeFrom] = React.useState("00:00")
  const [timeTo, setTimeTo] = React.useState("23:59")

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                value={
                  date?.from ? format(date.from, "yyyy-MM-dd") : ""
                }
                placeholder="Start date"
                className="w-[140px]"
                readOnly
              />
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                value={timeFrom}
                placeholder="00:00"
                className="w-[80px]"
                onChange={(e) => setTimeFrom(e.target.value)}
              />
            </div>
            <span className="flex items-center text-muted-foreground">-</span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                value={date?.to ? format(date.to, "yyyy-MM-dd") : ""}
                placeholder="End date"
                className="w-[140px]"
                readOnly
              />
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                value={timeTo}
                placeholder="23:59"
                className="w-[80px]"
                onChange={(e) => setTimeTo(e.target.value)}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}