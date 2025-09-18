"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";

export function TimePicker({
  time,
  onTimeChange,
  placeholder = "Select time",
  disabled = false,
  className,
}) {
  const [open, setOpen] = React.useState(false);

  // Generate time options in 30-minute intervals
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = new Date(
          `2000-01-01T${timeString}`
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        options.push({ value: timeString, display: displayTime });
      }
    }
    return options;
  }, []);

  const handleTimeSelect = (selectedTime) => {
    console.log(selectedTime);
    onTimeChange?.(selectedTime);
    setOpen(false);
  };

  const displayTime = React.useMemo(() => {
    if (!time) return placeholder;
    const timeOption = timeOptions.find((option) => option.value === time);
    return timeOption?.display || time;
  }, [time, timeOptions, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-4",
            !time && "text-muted-foreground",
            "border border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
          <span className="flex-1">{displayTime}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border-2 border-border shadow-lg"
        align="start"
        sideOffset={4}
      >
        <ScrollArea className="h-64">
          <div className="p-2">
            {timeOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className={cn(
                  "w-full justify-start font-normal h-10 px-3 mb-1",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-150",
                  time === option.value &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => handleTimeSelect(option.display)}
              >
                {option.display}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
