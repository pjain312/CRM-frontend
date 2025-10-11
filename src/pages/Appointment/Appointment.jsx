import React, { useState } from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../../services/appointment-service";
import { appointmentsColumns } from "../../lib/data-table.columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const Appointment = () => {
  const [filterType, setFilterType] = useState("today");
  const [customDate, setCustomDate] = useState(null);

  // Prepare query params based on filter type
  const getQueryParams = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filterType) {
      case "today":
        return { appointmentDate: format(today, "yyyy-MM-dd") };
      case "tomorrow":
        return { appointmentDate: format(tomorrow, "yyyy-MM-dd") };
      case "custom":
        return customDate ? { appointmentDate: format(customDate, "yyyy-MM-dd") } : {};
      case "all":
      default:
        return {};
    }
  };

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["all-appointments", filterType, customDate],
    queryFn: () => getAllAppointments(getQueryParams()),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="all">All Appointments</SelectItem>
                <SelectItem value="custom">Custom Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterType === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-64 justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {customDate ? format(customDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={setCustomDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}

          {/* Display selected filter info */}
          <div className="ml-auto text-sm text-gray-600">
            {filterType === "today" && "Showing today's appointments"}
            {filterType === "tomorrow" && "Showing tomorrow's appointments"}
            {filterType === "custom" && customDate && `Showing appointments for ${format(customDate, "MMM dd, yyyy")}`}
            {filterType === "all" && "Showing all appointments"}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div>
        {!isLoading && (
          <DataTable columns={appointmentsColumns} data={appointments} />
        )}
      </div>
    </div>
  );
};

export default Appointment;
