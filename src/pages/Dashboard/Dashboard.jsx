import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../../services/appointment-service";
import CompletedAppointment from "./CompletedAppointment";
import ScheduledAppointment from "./ScheduledAppointment";
import PendingCounts from "./PendingCounts";
import { format } from "date-fns";

export function Dashboard() {
    const { data: appointmentDetails } = useQuery({
        queryKey: ["appointment-today"],
        queryFn: () => getAllAppointments({appointmentDate: format(new Date(), "yyyy-MM-dd")}),
      });
  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
            <div className="flex-1 w-full lg:max-w-md">
                <ScheduledAppointment appointmentDetails ={appointmentDetails?.filter(appointment => appointment.StatusId != 3 && !appointment.EndTime)} />
            </div>
            <div className="flex-1 w-full lg:max-w-md">
                <CompletedAppointment appointmentDetails ={appointmentDetails?.filter(appointment => appointment.StatusId == 3 || appointment.EndTime)} />
            </div>
        </div>
        <div className="w-full lg:max-w-md">
            <PendingCounts />
        </div>
    </div>
  )
}

export default Dashboard;
