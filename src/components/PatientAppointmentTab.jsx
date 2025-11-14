import { useEffect, useState } from "react";
import { getPatientAppointments } from "../services/patient-service";
import { addHours, format, parse } from "date-fns";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Clock, User } from "lucide-react";
import ScheduleAppointmentForm from "./schedule-appointment-form";

const PatientAppointmentTab = ({ patientId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  
    useEffect(() => {
      fetchAppointments();
    }, [patientId]);

    const handleScheduleSuccess = () => {
      setScheduleFormOpen(false);
      fetchAppointments(); // Refresh the appointments list
    };
  
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getPatientAppointments(patientId);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };
  
    const formatAppointmentTime = (appointmentDate, appointmentTime) => {
      try {
        // Parse the appointment date and time
        const appointmentDateTime = parse(`${appointmentDate} ${appointmentTime}`, 'yyyy-MM-dd HH:mm:ss', new Date());
        
        // Format start time as 9:00 AM
        const startTime = format(appointmentDateTime, 'h:mm a');
        
        // Add 1 hour for end time
        const endDateTime = addHours(appointmentDateTime, 1);
        const endTime = format(endDateTime, 'h:mm a');
        
        return `${startTime} - ${endTime}`;
      } catch (error) {
        // Fallback if parsing fails
        return `${appointmentTime} - 1 Hour`;
      }
    };
  
    const calculateWaitingTime = (checkInTime, startTime) => {
      if (!checkInTime || !startTime) return null;
      
      try {
        const checkIn = parse(checkInTime, 'yyyy-MM-dd HH:mm:ss', new Date());
        const start = parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date());
        
        const diffInMs = start.getTime() - checkIn.getTime();
        const diffInMinutes = Math.round(diffInMs / (1000 * 60));
        
        return diffInMinutes;
      } catch (error) {
        return null;
      }
    };

    const getStatusColor = (status) => {
      if (status === "Cancelled") return "bg-red-100 text-red-600";
      if (status === "Confirmed") return "bg-green-100 text-green-600";
      if (status === "Pending") return "bg-yellow-100 text-yellow-600";
      return "bg-green-100 text-green-600";
    };
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
  
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <h3 className="text-lg font-semibold">Appointment History</h3>
          <Button 
            size="sm" 
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => setScheduleFormOpen(true)}
          >
            Schedule New
          </Button>
        </div>
        
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="p-3 sm:p-4 hover:shadow-md transition-shadow w-full">
                <CardContent className="p-0">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    {/* Avatar and Date Row */}
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-10 w-10 bg-blue-100 flex-shrink-0">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                          {getInitials(appointment?.Name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900 leading-tight">
                            {new Date(appointment.AppointmentDate).toLocaleDateString()}
                          </h3>
                          {(appointment?.EndTime || appointment?.Status) && (
                            <span className={`text-xs font-semibold ${appointment?.EndTime ? "bg-green-100 text-green-600" :getStatusColor(appointment?.Status)} px-2 py-1 rounded-full`}>
                             {appointment.EndTime ? "Treated" : appointment?.Status }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Physio Row */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-gray-700 text-sm truncate">
                        Dr. {appointment.Physio} PT
                      </span>
                    </div>
                    
                    {/* Time Row */}
                    <div className="space-y-1">
                      { !!appointment.AppointmentTime && <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-green-600 text-sm">
                          {formatAppointmentTime(appointment.AppointmentDate, appointment.AppointmentTime)}
                        </span>
                      </div>}
                      {calculateWaitingTime(appointment?.CheckInTime, appointment?.StartTime) !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                          Waiting Time: {format(appointment?.CheckInTime, 'h:mm a')} - {format(appointment?.StartTime, 'h:mm a')} ({calculateWaitingTime(appointment.CheckInTime, appointment.StartTime)} mins)
                          </span>
                        </div>
                      )}
  
                      {calculateWaitingTime(appointment?.StartTime, appointment?.EndTime) !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Actual Session Time: {format(appointment?.StartTime, 'h:mm a')} - {format(appointment?.EndTime, 'h:mm a')} ({calculateWaitingTime(appointment?.StartTime, appointment?.EndTime)} mins)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Amount Row */}
                    {appointment.IsInvoiceGenerated && <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium text-gray-700">
                        {appointment?.Amount != null ? `Rs. ${parseFloat(appointment.Amount).toFixed(2)}` : "Covered In Package"}
                      </span>
                    </div>}
                  </div>
  
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 bg-blue-100 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(appointment?.Name)}
                      </AvatarFallback>
                    </Avatar>
  
                    {/* Appointment Details */}
                    <div className="flex-1 space-y-2">
                      {/* Header Row: Date and Physio */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {new Date(appointment.AppointmentDate).toLocaleDateString()}
                          </h3>
                          {(appointment?.EndTime || appointment?.Status) && (
                            <span className={`text-xs font-semibold ${ appointment?.EndTime ? "bg-green-100 text-green-600" : getStatusColor(appointment?.Status)} px-2 py-1 rounded-full`}>
                             {appointment.EndTime ? "Treated" : appointment?.Status }
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-700">Dr. {appointment.Physio} PT</span>
                        </div>
                      </div>
                      
                      {/* Time Row */}
                      <div className="space-y-1">
                       { !!appointment.AppointmentTime &&
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">
                            {formatAppointmentTime(appointment.AppointmentDate, appointment.AppointmentTime)}
                          </span>
                        </div>}
                        {!!appointment.CheckInTime && !!appointment.StartTime && calculateWaitingTime(appointment?.CheckInTime, appointment?.StartTime) !== null && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Waiting Time: {format(appointment?.CheckInTime, 'h:mm a')} - {format(appointment?.StartTime, 'h:mm a')} ({calculateWaitingTime(appointment.CheckInTime, appointment.StartTime)} mins)
                            </span>
                          </div>
                        )}
                        {!!appointment.StartTime && !!appointment.EndTime && calculateWaitingTime(appointment?.StartTime, appointment?.EndTime) !== null && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Actual Session Time: {format(appointment?.StartTime, 'h:mm a')} - {format(appointment?.EndTime, 'h:mm a')} ({calculateWaitingTime(appointment?.StartTime, appointment?.EndTime)} mins)
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Amount Row */}
                      {appointment.IsInvoiceGenerated && <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-700">
                          {appointment?.Amount != null ? `Rs. ${parseFloat(appointment.Amount).toFixed(2)}` : "Covered In Package"}
                        </span>
                      </div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Schedule Appointment Form */}
        <ScheduleAppointmentForm
          patient={{ Id: patientId }}
          openIcon={scheduleFormOpen}
          onOpenIconChange={setScheduleFormOpen}
          notDialogTrigger={true}
          onSuccess={handleScheduleSuccess}
        />
      </div>
    );
  };

  export default PatientAppointmentTab;