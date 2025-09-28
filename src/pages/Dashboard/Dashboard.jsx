import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../../services/appointment-service";
import ScheduledAppointment from "./ScheduledAppointment";
import CompletedAppointment from "./CompletedAppointment";
import PackageInvoice from "../../components/package-invoice";

export function Dashboard() {
    const { data: appointmentDetails } = useQuery({
        queryKey: ["appointment-today"],
        queryFn: () => getAllAppointments({appointmentDate: new Date()}),
      });
      console.log(appointmentDetails)
  return (
    <div className="flex gap-6">
        <ScheduledAppointment appointmentDetails ={appointmentDetails?.filter(appointment => appointment.StatusId != 3 && !appointment.EndTime)} />
        <CompletedAppointment appointmentDetails ={appointmentDetails?.filter(appointment => appointment.StatusId == 3 || appointment.EndTime)} />

            {/* <PackageInvoice /> */}
    </div>
  )
}

export default Dashboard;
