import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CalendarIcon, ClockIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllAppointments } from "../services/appointment-service";

function PatientInfo({ title, patient }) {
  const [open, setOpen] = useState(false);

  const { data: appointmentsData } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: () =>
      getAllAppointments({ patientId: patient.Id || patient.PatientId }),
  });

  // Handle different possible data structures from API
  const appointments = Array.isArray(appointmentsData)
    ? appointmentsData
    : appointmentsData?.appointments || appointmentsData?.data || [];

  console.log("Appointments Data", appointmentsData);
  console.log("Data type:", typeof appointmentsData);
  console.log("Is Array:", Array.isArray(appointmentsData));
  console.log(
    "Data keys:",
    appointmentsData ? Object.keys(appointmentsData) : "null/undefined"
  );
  console.log("Processed Appointments", appointments);

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Rescheduled":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:orange-blue-400";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex px-2 w-full hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        View Appointment
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-balance">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="h-5 w-5" />
                Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-base font-semibold">{patient.Name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p className="text-base">{patient.Age} years old</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base">{patient.Gender}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-base flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    {patient.PhoneNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Appointment History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                Appointment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!appointments ||
              !Array.isArray(appointments) ||
              appointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No appointments found for this patient.
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.AppointmentId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="space-y-2 sm:space-y-1">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {formatDate(appointment.AppointmentDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {appointment.AppointmentTime}
                          </span>
                        </div>
                        <p className="text-sm font-medium">
                          {appointment.AppointmentType}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Badge
                          className={`${getStatusColor(
                            appointment.Status
                          )} border-0 font-medium`}
                        >
                          {appointment.Status?.charAt(0).toUpperCase() +
                            appointment.Status?.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PatientInfo;
