import React from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../../services/appointment-service";
import { appointmentsColumns } from "../../lib/data-table.columns";

const Appointment = () => {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["all-appointments"],
    queryFn: getAllAppointments,
  });

  return (
    <div>
      {!isLoading && (
        <DataTable columns={appointmentsColumns} data={appointments} />
      )}
    </div>
  );
};

export default Appointment;
