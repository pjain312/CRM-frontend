import React from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getPatientLeads } from "../../services/leads-service";
import { leadsColumns } from "../../lib/data-table.columns";
import { useLocation } from "react-router-dom";

const Leads = () => {
  const location = useLocation();
  const { params } = location.state || {};
  
  const { data: leads, isLoading } = useQuery({
    queryKey: ["patient-leads", params],
    queryFn: () => getPatientLeads(params),
  });
  
  return (
    <div>
      {!isLoading && (
        <DataTable columns={leadsColumns} data={leads} showAddButton={true} actions={"leads"} />
      )}
    </div>
  );
};

export default Leads;
