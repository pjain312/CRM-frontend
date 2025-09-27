import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck2, CalendarSync, CalendarX, CalendarX2, CheckCircle, Clock, Hourglass, Timer, TimerOff, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import RescheduleConfirmAppointmentForm from "../../components/reschedule-confirm-appointment-form";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { checkinPatient, startSession } from "../../services/session-service";
import { toast } from "sonner";

const AppointmentCard = ({appointmentData, value}) =>{
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const queryClient = useQueryClient();

    const { mutate: checkinPatientMutation } = useMutation({
        mutationFn: checkinPatient,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["appointment-today"] });
          toast.success("Patient checked in successfully");
        },
        onError: () => {
          toast.error("Failed to check in patient");
        },
      });

      const { mutate: startSessionMutation } = useMutation({
        mutationFn: startSession,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["appointment-today"] });
          toast.success("Session started successfully");
        },
        onError: () => {
          toast.error("Failed to start session");
        },
      });

    if (!appointmentData || appointmentData.length === 0) {
        return (
            <Card className="p-8">
                <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <CalendarX className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">`No {value} appointments found`</h3>
                        <p className="text-sm text-gray-500">
                            There are no appointments to display at the moment.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }



      const handlePatientCheckin = (appt) => {
        checkinPatientMutation({patientId: appt.PatientId, appointmentId: appt.AppointmentId});
      }

      const handleStartSession = (appt) =>{
        startSessionMutation(appt.SessionId)
      }

    return(
        <>
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {appointmentData?.map((appointment) => {
                return (
                    <Card key={appointment.AppointmentId} className="p-4 shadow-sm w-full max-w-2xl relative">
                        <div 
                            title="Cancel Appointment" 
                            className="absolute top-2 right-2 cursor-pointer"
                        >
                            <CalendarX2 className="h-3 w-3" color="red"/>
                        </div>

                        <CardContent className="flex items-center gap-4 p-0">
                            {/* Avatar Section */}
                            <Avatar className="h-12 w-12 bg-blue-100">
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                    {appointment.Name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">
                                        {appointment.Gender === "Male" ? "Mr.": "Ms."}{appointment.Name}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600">
                                    {appointment.PhoneNumber}
                                </div>

                                {!appointment.IsPatientCheckedIn && 
                                <>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4 text-red-400" />
                                        <span>
                                            Scheduled at: {appointment.AppointmentTime}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            appointment.StatusId == 3 
                                                ? 'bg-red-100 text-red-600' 
                                                : appointment.StatusId == 1
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {appointment.Status}
                                        </span>
                                    </div>
                                    </>
                                }

                                {!!(appointment.IsPatientCheckedIn && !appointment.StartTime )&& <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Checked In</span>
                                </div>}
                                {!!(appointment.IsPatientCheckedIn && appointment.StartTime )&& <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Hourglass className="h-4 w-4 text-yellow-500" />
                                    <span>Ongoing Session</span>
                                </div>}
                            </div>

                            {/* Action Icon */}
                            <div className="flex-shrink-0 flex">
                                {!!(appointment.StatusId == 1 && !appointment.IsPatientCheckedIn) && <div 
                                    title = "Reschedule Appointment" 
                                    className="h-8 w-8 bg-pink-300 rounded-full flex items-center justify-center mr-2 cursor-pointer hover:bg-pink-400 transition-colors"
                                    onClick={() => {
                                        setSelectedAppointment(appointment);
                                        setRescheduleOpen(true);
                                    }}
                                >
                                    <CalendarSync className="h-5 w-5 text-white" />
                                </div>}
                                {!!(appointment.StatusId == 2 && !appointment.IsPatientCheckedIn) && <div title = "Confirm Appointment" className="h-8 w-8 bg-green-300 rounded-full flex items-center justify-center mr-2">
                                    <CalendarCheck2 className="h-5 w-5 text-white" />
                                </div>}
                                {!!(appointment.StatusId == 1 && !appointment.IsPatientCheckedIn) && <div title = "Checkin Patient" className="h-8 w-8 bg-green-300 cursor-pointer rounded-full flex items-center hover:bg-green-400 justify-center mr-2" onClick={() => handlePatientCheckin(appointment)}>
                                    <UserRoundPlus className="h-5 w-5 text-white" />
                                </div>}
                                {!!(appointment.StatusId == 1 && appointment.IsPatientCheckedIn && !appointment.StartTime) && 
                                    <div title = "Start Session" onClick = {()=>handleStartSession(appointment)}className="h-8 w-8 cursor-pointer bg-green-300 rounded-full flex items-center justify-center mr-2">
                                        <Timer className="h-5 w-5 text-white" />
                                    </div>
                                }
                                {!!(appointment.StartTime && !appointment.EndTime) &&<div title = "End Session" className="h-8 w-8 bg-green-300 rounded-full flex items-center justify-center mr-2">
                                    <TimerOff className="h-5 w-5 text-white" />
                                </div>}
                                {/* {!!(appointment.EndTime && !appointment.IsInvoiceGenerated) && <div title = "Checkout Patient" className="h-8 w-8 bg-green-300 rounded-full flex items-center justify-center mr-2">
                                    <UserCheck className="h-5 w-5 text-white" />
                                </div>} */}
                             
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
        {rescheduleOpen && selectedAppointment && (
            <RescheduleConfirmAppointmentForm 
                appointment={selectedAppointment}
                openIcon={rescheduleOpen}
                onOpenIconChange={setRescheduleOpen}
                notDialogTrigger={true}
            />
        )}
    </>
    )
}

export default AppointmentCard