import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../../services/appointment-service";
import CompletedAppointment from "./CompletedAppointment";
import ScheduledAppointment from "./ScheduledAppointment";
import PendingCounts from "./PendingCounts";

export function Dashboard() {
    const { data: appointmentDetails } = useQuery({
        queryKey: ["appointment-today"],
        queryFn: () => getAllAppointments({appointmentDate: new Date()}),
      });
  return (
    <>
        <div className="flex gap-6">
            <ScheduledAppointment appointmentDetails ={appointmentDetails?.filter(appointment => appointment.StatusId != 3 && !appointment.EndTime)} />
            <CompletedAppointment appointmentDetails ={appointmentDetails?.filter(appointment => appointment.StatusId == 3 || appointment.EndTime)} />
        </div>
        <div> <PendingCounts />  </div>
    </>
  )
}

export default Dashboard;
