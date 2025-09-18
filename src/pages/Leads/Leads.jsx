import React from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getPatientLeads } from "../../services/leads-service";
import { leadsColumns } from "../../lib/data-table.columns";

const Leads = () => {
  const { data: leads, isLoading } = useQuery({
    queryKey: ["patient-leads"],
    queryFn: getPatientLeads,
  });
  console.log(leads);
  return (
    <div>
      {!isLoading && (
        <DataTable columns={leadsColumns} data={leads} showAddButton={true} />
      )}
    </div>
  );
};

export default Leads;
