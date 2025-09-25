import { useQuery } from "@tanstack/react-query";
import React from "react";
import { DataTable } from "../../components/data-table";
import { sessionTypesColumns } from "../../lib/data-table.columns";
import { getSessionTypes } from "../../services/packages-service";

const SessionTypes = () => {
  const { data: sessionTypes, isLoading } = useQuery({
    queryKey: ["sessionTypes"],
    queryFn: getSessionTypes,
  });

  return (
    <div>
      {!isLoading && sessionTypes && (
        <DataTable columns={sessionTypesColumns} data={sessionTypes} showAddButton={true} actions={"sessionTypes"} />
      )}
    </div>
  );
};

export default SessionTypes;
