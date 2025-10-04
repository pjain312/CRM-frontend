import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
} from "lucide-react";

function AppointmentDetail({ appointment, patient, open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use internal state if no external state is provided
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Rescheduled":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
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
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex px-2 w-full hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        View Appointment
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-balance">
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this appointment and patient.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-base font-semibold">{patient?.Gender === "Male" ? "Mr. " : "Ms. "}{patient?.Name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p className="text-base">{patient?.Age} years old</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base">{patient?.Gender}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-base flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    {patient?.PhoneNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Appointment Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                Appointment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Appointment Date
                  </p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">
                      {formatDate(appointment?.AppointmentDate)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Appointment Time
                  </p>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">
                      {appointment?.AppointmentTime}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Appointment Type
                  </p>
                  <p className="text-base font-medium">
                    {appointment?.AppointmentType}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    className={`${getStatusColor(
                      appointment?.Status
                    )} border-0 font-medium`}
                  >
                    {appointment?.Status?.charAt(0).toUpperCase() +
                      appointment?.Status?.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Additional appointment details if available */}
              {appointment?.Comments && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Comments
                  </p>
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-base leading-relaxed">
                      {appointment.Comments}
                    </p>
                  </div>
                </div>
              )}

              {appointment?.Location && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base">{appointment.Location}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentDetail;
