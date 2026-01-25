import React, { useState, useMemo } from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getPatientLeads } from "../../services/leads-service";
import { leadsColumns } from "../../lib/data-table.columns";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

const Leads = () => {
  const location = useLocation();
  const { params } = location.state || {};
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [leadTypeFilter, setLeadTypeFilter] = useState("all");
  
  const { data: leads, isLoading } = useQuery({
    queryKey: ["patient-leads", params],
    queryFn: () => getPatientLeads(params),
  });

  // Get unique lead types from leads data
  const uniqueLeadTypes = useMemo(() => {
    if (!leads) return [];
    const types = leads
      .map((lead) => lead.LeadTypeName)
      .filter((type) => type && type.trim() !== "");
    return [...new Set(types)].sort();
  }, [leads]);

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    if (value !== "custom") {
      setCustomDate(null);
    }
  };

  const handleCustomDateSelect = (date) => {
    if (date) {
      setCustomDate(date);
      setCalendarOpen(false);
    }
  };

  const filteredLeads = useMemo(() => {
    if (!leads) return [];

    let filtered = leads;

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((lead) => {
        if (!lead.CreatedOn) return false;
        
        const createdDate = new Date(lead.CreatedOn);
        const leadDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
        
        switch (dateFilter) {
          case "today":
            return leadDate.getTime() === today.getTime();
          
          case "thisWeek": {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return leadDate >= weekStart && leadDate <= today;
          }
          
          case "thisMonth":
            return createdDate.getMonth() === now.getMonth() && 
                   createdDate.getFullYear() === now.getFullYear();
          
          case "custom":
            if (!customDate) return false;
            const selectedDate = new Date(customDate.getFullYear(), customDate.getMonth(), customDate.getDate());
            return leadDate.getTime() === selectedDate.getTime();
          
          default:
            return true;
        }
      });
    }

    // Filter by lead type
    if (leadTypeFilter !== "all") {
      filtered = filtered.filter((lead) => lead.LeadTypeName === leadTypeFilter);
    }

    return filtered;
  }, [leads, dateFilter, customDate, leadTypeFilter]);
  
  return (
    <div>
      {!isLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap pt-4">
            <Label htmlFor="date-filter">Filter by Date:</Label>
            <Select value={dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger id="date-filter" className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {dateFilter === "custom" && (
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !customDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={handleCustomDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}

            <Label htmlFor="lead-type-filter">Filter by Type:</Label>
            <Select value={leadTypeFilter} onValueChange={setLeadTypeFilter}>
              <SelectTrigger id="lead-type-filter" className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueLeadTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DataTable columns={leadsColumns} data={filteredLeads} showAddButton={true} actions={"leads"} />
        </div>
      )}
    </div>
  );
};

export default Leads;
