import React from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../../services/appointment-service";
import { appointmentsColumns } from "../../lib/data-table.columns";

const Leads = () => {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["patient-leads"],
    queryFn: getAllAppointments,
  });
  console.log(appointments);
  return (
    <div>
      {!isLoading && (
        <DataTable columns={appointmentsColumns} data={appointments} />
      )}
    </div>
  );
};

export default Leads;
