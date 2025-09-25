import React from "react";
import { DataTable } from "../../components/data-table";
import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../../services/packages-service";
import { packagesColumns } from "../../lib/data-table.columns";

const Packages = () => {
  const { data: packages, isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  return (
    <div>
      {!isLoading && packages && (
        <DataTable columns={packagesColumns} data={packages} showAddButton={true} actions={"packages"} />
      )}
    </div>
  );
};

export default Packages;
