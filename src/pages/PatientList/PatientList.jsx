import React, { useState, useMemo } from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getRegisteredPatients } from "../../services/leads-service";
import { getPendingFollowupPatients } from "../../services/appointment-service";
import { patientListsColumns } from "../../lib/data-table.columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Filter } from "lucide-react";
import { useLocation } from "react-router-dom";
import { IconRefresh } from "@tabler/icons-react";
import { Label } from "../../components/ui/label";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

const Leads = () => {
  const location = useLocation();
  const { showPendingFollowups } = location.state || {};
  const [showAllPatients, setShowAllPatients] = useState(!showPendingFollowups);
  const [filterStatus, setFilterStatus] = useState("active");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [leadTypeFilter, setLeadTypeFilter] = useState("all");
  
  const { data: patientList, isLoading } = useQuery({
    queryKey: ["patient-list", showAllPatients],
    queryFn: showAllPatients ? getRegisteredPatients : getPendingFollowupPatients,
  });

  // Get unique lead types from patient data
  const uniqueLeadTypes = useMemo(() => {
    if (!patientList) return [];
    const types = patientList
      .map((patient) => patient.LeadTypeName)
      .filter((type) => type && type.trim() !== "");
    return [...new Set(types)].sort();
  }, [patientList]);

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

  const filteredPatientList = useMemo(() => {
    if (!patientList) return [];
    
    let filtered = patientList;
    
    // Filter by status
    if (filterStatus === "active") {
      filtered = filtered.filter((patient) => !patient.IsPatientClosed);
    } else if (filterStatus === "closed") {
      filtered = filtered.filter((patient) => patient.IsPatientClosed === 1);
    }
    
    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((patient) => {
        if (!patient.RegistrationDate) return false;
        
        const registrationDate = new Date(patient.RegistrationDate);
        const patientDate = new Date(registrationDate.getFullYear(), registrationDate.getMonth(), registrationDate.getDate());
        
        switch (dateFilter) {
          case "today":
            return patientDate.getTime() === today.getTime();
          
          case "thisWeek": {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return patientDate >= weekStart && patientDate <= today;
          }
          
          case "thisMonth":
            return registrationDate.getMonth() === now.getMonth() && 
                   registrationDate.getFullYear() === now.getFullYear();
          
          case "custom":
            if (!customDate) return false;
            const selectedDate = new Date(customDate.getFullYear(), customDate.getMonth(), customDate.getDate());
            return patientDate.getTime() === selectedDate.getTime();
          
          default:
            return true;
        }
      });
    }

    // Filter by lead type
    if (leadTypeFilter !== "all") {
      filtered = filtered.filter((patient) => patient.LeadTypeName === leadTypeFilter);
    }
    
    return filtered;
  }, [patientList, filterStatus, dateFilter, customDate, leadTypeFilter]);

  const totalCount = patientList?.length || 0;
  const filteredCount = filteredPatientList?.length || 0;

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      {!showAllPatients && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Pending Followup Patients</h1>
        </div>
      )}
      
      {/* Filter Section */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <label 
              htmlFor="status-filter" 
              className="text-sm font-medium text-gray-700 whitespace-nowrap"
            >
              Filter by Status:
            </label>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger 
              id="status-filter" 
              className="w-full sm:w-[180px]"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Label htmlFor="date-filter" className="whitespace-nowrap">Filter by Date:</Label>
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

          {/* Lead Type Filter */}
          <Label htmlFor="lead-type-filter" className="whitespace-nowrap">Filter by Type:</Label>
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
      </Card>

      {/* Table Section */}
      <div className="w-full overflow-x-auto">
        {!isLoading && (
          <DataTable columns={patientListsColumns} data={filteredPatientList} />
        )}
      </div>
    </div>
  );
};

export default Leads;
