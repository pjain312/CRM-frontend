import React from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getRegisteredPatients } from "../../services/leads-service";
import { patientListsColumns } from "../../lib/data-table.columns";

const Leads = () => {
  const { data: patientList, isLoading } = useQuery({
    queryKey: ["patient-leads"],
    queryFn: getRegisteredPatients,
  });
  return (
    <div>
      {!isLoading && (
        <DataTable columns={patientListsColumns} data={patientList} />
      )}
    </div>
  );
};

export default Leads;
