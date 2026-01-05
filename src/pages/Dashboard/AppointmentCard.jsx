import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck2, CalendarSync, CalendarX, CheckCircle, Clock, Hourglass, Timer, TimerOff, UserRoundPlus, UserRoundX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { parse } from "date-fns";
import CancelAppointmentForm from "../../components/cancel-appointment-form";
import CheckoutPatientForm from "../../components/checkout-patient-form";
import RescheduleConfirmAppointmentForm from "../../components/reschedule-confirm-appointment-form";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { checkinPatient, endSession, startSession, undoCheckin } from "../../services/session-service";
import PackageInvoice from "../../components/package-invoice";
import DailyInvoice from "../../components/daily-invoice";

const AppointmentCard = ({appointmentData, value}) =>{
    const navigate = useNavigate();
    const [rescheduleOpen, setRescheduleOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [cancelFormOpen, setCancelFormOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showPackageInvoice, setShowPackageInvoice] = useState(false);
    const [showDailyInvoice, setShowDailyInvoice] = useState(false);
    const queryClient = useQueryClient();

    // Timer state management
    const [sessionTimers, setSessionTimers] = useState({});
    const intervalRefs = useRef({});

    // Timer utility functions
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = (appointmentId) => {
        const startTime = Date.now();
        setSessionTimers(prev => ({
            ...prev,
            [appointmentId]: { startTime, elapsed: 0 }
        }));

        const interval = setInterval(() => {
            setSessionTimers(prev => ({
                ...prev,
                [appointmentId]: {
                    ...prev[appointmentId],
                    elapsed: Math.floor((Date.now() - startTime) / 1000)
                }
            }));
        }, 1000);

        intervalRefs.current[appointmentId] = interval;
    };

    const stopTimer = (appointmentId) => {
        if (intervalRefs.current[appointmentId]) {
            clearInterval(intervalRefs.current[appointmentId]);
            delete intervalRefs.current[appointmentId];
        }
        setSessionTimers(prev => {
            const newTimers = { ...prev };
            delete newTimers[appointmentId];
            return newTimers;
        });
    };

    // Cleanup intervals on unmount
    useEffect(() => {
        return () => {
            Object.values(intervalRefs.current).forEach(interval => clearInterval(interval));
        };
    }, []);

    // Restore timers for active sessions on mount or when appointmentData changes
    useEffect(() => {
        if (!appointmentData || appointmentData.length === 0) return;

        // Get all current appointment IDs
        const currentAppointmentIds = new Set(appointmentData.map(apt => apt.AppointmentId));

        appointmentData.forEach((appointment) => {
            // If session is active (checked in, started, but not ended) and timer not already running
            if (
                appointment.IsPatientCheckedIn &&
                appointment.StartTime &&
                !appointment.EndTime &&
                !intervalRefs.current[appointment.AppointmentId]
            ) {
                try {
                    // Parse StartTime from backend format 'yyyy-MM-dd HH:mm:ss'
                    const startTimeDate = parse(appointment.StartTime, 'yyyy-MM-dd HH:mm:ss', new Date());
                    const startTimeMs = startTimeDate.getTime();
                    const now = Date.now();
                    const elapsedSeconds = Math.floor((now - startTimeMs) / 1000);

                    // Only restore if elapsed time is positive (session started in the past)
                    if (elapsedSeconds >= 0) {
                        setSessionTimers(prev => ({
                            ...prev,
                            [appointment.AppointmentId]: { startTime: startTimeMs, elapsed: elapsedSeconds }
                        }));

                        // Start the interval to continue counting
                        const interval = setInterval(() => {
                            setSessionTimers(prev => {
                                if (!prev[appointment.AppointmentId]) return prev;
                                return {
                                    ...prev,
                                    [appointment.AppointmentId]: {
                                        ...prev[appointment.AppointmentId],
                                        elapsed: Math.floor((Date.now() - startTimeMs) / 1000)
                                    }
                                };
                            });
                        }, 1000);

                        intervalRefs.current[appointment.AppointmentId] = interval;
                    }
                } catch (error) {
                    console.error('Error parsing StartTime for appointment:', appointment.AppointmentId, error);
                }
            }
        });

        // Clean up timers for appointments that are no longer active or have ended
        Object.keys(intervalRefs.current).forEach(appointmentId => {
            const appointmentIdNum = parseInt(appointmentId);
            if (!currentAppointmentIds.has(appointmentIdNum)) {
                // Appointment no longer in the list, clean up
                if (intervalRefs.current[appointmentId]) {
                    clearInterval(intervalRefs.current[appointmentId]);
                    delete intervalRefs.current[appointmentId];
                }
                setSessionTimers(prev => {
                    const newTimers = { ...prev };
                    delete newTimers[appointmentIdNum];
                    return newTimers;
                });
            } else {
                const appointment = appointmentData.find(apt => apt.AppointmentId === appointmentIdNum);
                if (appointment && (appointment.EndTime || !appointment.IsPatientCheckedIn || !appointment.StartTime)) {
                    // Session has ended or is no longer active, clean up
                    if (intervalRefs.current[appointmentId]) {
                        clearInterval(intervalRefs.current[appointmentId]);
                        delete intervalRefs.current[appointmentId];
                    }
                    setSessionTimers(prev => {
                        const newTimers = { ...prev };
                        delete newTimers[appointmentIdNum];
                        return newTimers;
                    });
                }
            }
        });
    }, [appointmentData]);

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

      const { mutate: undoCheckinMutation } = useMutation({
        mutationFn: (sessionId) => undoCheckin({sessionId: sessionId}),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["appointment-today"] });
          toast.success("Session deleted");
        },
        onError: () => {
          toast.error("Failed to delete session");
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

      const { mutate: endSessionMutation } = useMutation({
        mutationFn: endSession,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["appointment-today"] });
          queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
          toast.success("Session ended successfully");
          setCheckoutOpen(true);
        },
        onError: () => {
          toast.error("Failed to end session");
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
        startSessionMutation(appt.SessionId);
        startTimer(appt.AppointmentId);
      }

      const handleEndSession = (appt) =>{
        setSelectedAppointment(appt);
        endSessionMutation(appt.SessionId);
        stopTimer(appt.AppointmentId);
      }

      const handleUndoCheckin = (appt) =>{
        setSelectedAppointment(appt);
        undoCheckinMutation(appt.SessionId);
        stopTimer(appt.AppointmentId);
      }

      const handlePatientProfileClick = (patientId) => {
        navigate(`/patient/${patientId}`);
      }

    return(
        <>
        <div className="space-y-4 max-h-150 overflow-y-auto">
            {appointmentData?.map((appointment) => {
                return (
                    <Card key={appointment.AppointmentId} className="p-4 shadow-sm w-full max-w-2xl relative">

                        <CardContent className="flex items-center gap-4 p-0">
                            {/* Avatar Section */}
                            <Avatar 
                                className="h-12 w-12 bg-blue-100 cursor-pointer hover:bg-blue-200 transition-colors"
                                onClick={() => handlePatientProfileClick(appointment.PatientId)}
                                title="Click to view patient profile"
                            >
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                    {appointment.Name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span 
                                        className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => handlePatientProfileClick(appointment.PatientId)}
                                        title="Click to view patient profile"
                                    >
                                        {appointment.Gender === "Male" ? "Mr.": "Ms."} {appointment.Name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {"Dr."} {appointment.PhysioName} PT
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
                                            Scheduled at: {appointment.FormattedAppointmentTime}
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
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="px-2 py-1 rounded-full cursor-pointer text-xs font-medium bg-red-100 text-red-600" onClick={() => {
                                            setSelectedAppointment(appointment);
                                            setCancelFormOpen(true);
                                        }}>
                                            Cancel Appointment
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
                                {!!(appointment.IsPatientCheckedIn && appointment.StartTime && sessionTimers[appointment.AppointmentId]) && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600 font-mono">
                                        <Timer className="h-4 w-4 text-blue-500" />
                                        <span className="font-semibold">
                                            {formatTime(sessionTimers[appointment.AppointmentId].elapsed)}
                                        </span>
                                    </div>
                                )}
                            </div>

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
                                {!!(appointment.StatusId == 2 && !appointment.IsPatientCheckedIn) && 
                                    <div title = "Confirm Appointment" 
                                        onClick={() => {
                                        setSelectedAppointment(appointment);
                                        setRescheduleOpen(true);
                                         }}
                                        className="h-8 w-8 cursor-pointner bg-green-300 rounded-full flex items-center hover:bg-green-400 justify-center mr-2 cursor-pointer hover:bg-green-400 transition-colors"
                                    >
                                        <CalendarCheck2 className="h-5 w-5 text-white" />
                                    </div>
                                }
                                {!! appointment.IsPatientCheckedIn &&
                                    <div title = "Undo Checkin / Session" onClick={()=>handleUndoCheckin(appointment)} className="h-8 w-8 bg-red-300 cursor-pointer hover:bg-red-400 rounded-full flex items-center justify-center mr-2">
                                        <UserRoundX className="h-5 w-5 text-white" />
                                    </div>
                                }
                                {!!(appointment.StatusId == 1 && !appointment.IsPatientCheckedIn) && <div title = "Checkin Patient" className="h-8 w-8 bg-green-300 cursor-pointer rounded-full flex items-center hover:bg-green-400 justify-center mr-2" onClick={() => handlePatientCheckin(appointment)}>
                                    <UserRoundPlus className="h-5 w-5 text-white" />
                                </div>}
                                {!!(appointment.StatusId == 1 && appointment.IsPatientCheckedIn && !appointment.StartTime) && 
                                    <div title = "Start Session" onClick = {()=>handleStartSession(appointment)}className="h-8 w-8 cursor-pointer bg-green-300 rounded-full flex items-center justify-center mr-2">
                                        <Timer className="h-5 w-5 text-white" />
                                    </div>
                                }
                                {!!(appointment.StartTime && !appointment.EndTime) &&
                                    <div title = "End Session" onClick={()=>handleEndSession(appointment)} className="h-8 w-8 bg-orange-300 cursor-pointer hover:bg-orange-400 rounded-full flex items-center justify-center mr-2">
                                        <TimerOff className="h-5 w-5 text-white" />
                                    </div>
                                }
                             
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
        {cancelFormOpen && selectedAppointment && <CancelAppointmentForm notDialogTrigger = {true} openIcon = {cancelFormOpen} onOpenIconChange={setCancelFormOpen} appointment={selectedAppointment} />}

        {checkoutOpen && <CheckoutPatientForm session={selectedAppointment} open={checkoutOpen} onOpenChange={setCheckoutOpen} setShowPackageInvoice = {setShowPackageInvoice} setShowDailyInvoice = {setShowDailyInvoice} />}
        {showPackageInvoice && <PackageInvoice appointment={selectedAppointment} open={showPackageInvoice} onOpenChange={setShowPackageInvoice} />}
        {showDailyInvoice && <DailyInvoice appointment={selectedAppointment} open={showDailyInvoice} onOpenChange={setShowDailyInvoice} />}
    </>
    )
}

export default AppointmentCard