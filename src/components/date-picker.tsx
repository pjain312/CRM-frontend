import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";

function DatePicker({
  date,
  onDateChange,
  placeholder = "Select a date",
  disabled = false,
  className,
}) {
  const [open, setOpen] = React.useState(false);
  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const selectedDate = date ? new Date(date) : undefined;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      onDateChange?.(dateString);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={"sm"}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-4",
            !date && "text-muted-foreground",
            "border border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
          <span className="flex-1">
            {selectedDate ? format(selectedDate, "PPP") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 border-2 border-border shadow-lg"
        align="start"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < startOfToday}
          initialFocus
          className="rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
