import React, { useState, useMemo } from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getRegisteredPatients } from "../../services/leads-service";
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
import { Filter } from "lucide-react";

const Leads = () => {
  const [filterStatus, setFilterStatus] = useState("active");
  const { data: patientList, isLoading } = useQuery({
    queryKey: ["patient-leads"],
    queryFn: getRegisteredPatients,
  });

  const filteredPatientList = useMemo(() => {
    if (!patientList) return [];
    
    if (filterStatus === "active") {
      return patientList.filter((patient) => !patient.IsPatientClosed);
    } else if (filterStatus === "closed") {
      return patientList.filter((patient) => patient.IsPatientClosed === 1);
    } else {
      return patientList;
    }
  }, [patientList, filterStatus]);

  const totalCount = patientList?.length || 0;
  const filteredCount = filteredPatientList?.length || 0;

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Filter Section */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
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
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Showing
            </span>
            <Badge 
              variant="secondary" 
              className="text-sm font-medium px-3 py-1"
            >
              {filteredCount}
              {filterStatus !== "all" && (
                <span className="text-muted-foreground ml-1">
                  / {totalCount}
                </span>
              )}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {filteredCount === 1 ? "patient" : "patients"}
              {filterStatus === "active" && " (Active)"}
              {filterStatus === "closed" && " (Closed)"}
            </span>
          </div>
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
