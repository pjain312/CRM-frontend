import { useEffect, useState } from "react";
import { getPatientAppointments } from "../services/patient-service";
import { addHours, format, parse } from "date-fns";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Clock, User, Edit, MessageSquare, DollarSign, Calendar } from "lucide-react";
import ScheduleAppointmentForm from "./schedule-appointment-form";
import RescheduleConfirmAppointmentForm from "./reschedule-confirm-appointment-form";

const PatientAppointmentTab = ({ patientId, isPatientClosed }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
  
    useEffect(() => {
      fetchAppointments();
    }, [patientId]);

    const handleScheduleSuccess = () => {
      setScheduleFormOpen(false);
      fetchAppointments(); // Refresh the appointments list
    };

    const handleEditClick = (appointment) => {
      setSelectedAppointment(appointment);
      setEditFormOpen(true);
    };

    const handleEditSuccess = () => {
      setEditFormOpen(false);
      setSelectedAppointment(null);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {/* <Calendar className="h-5 w-5 text-blue-600" /> */}
            <h3 className="text-lg font-bold text-gray-900">Appointment History</h3>
          </div>
          {!isPatientClosed &&<Button 
            size="sm" 
            className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setScheduleFormOpen(true)}
          >
            Schedule New
          </Button>}
        </div>
        
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-base">No appointments found</p>
            <p className="text-gray-400 text-sm mt-1">Schedule an appointment to get started</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="p-3 sm:p-4 hover:shadow-lg transition-all duration-200 border-l-3 border-l-blue-200 w-full">
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
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <h3 className="text-base font-bold text-gray-900 leading-tight">
                              {new Date(appointment.AppointmentDate).toLocaleDateString()}
                            </h3>
                            {(appointment?.EndTime || appointment?.Status) && (
                              <span className={`text-xs font-semibold ${appointment?.EndTime ? "bg-green-100 text-green-700 border border-green-200" :getStatusColor(appointment?.Status)} px-2.5 py-1 rounded-full`}>
                               {appointment.EndTime ? "Treated" : appointment?.Status }
                              </span>
                            )}
                          </div>
                          {!isPatientClosed && appointment?.Status !== "Cancelled" && !appointment?.IsPatientCheckedIn && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 flex-shrink-0 hover:bg-blue-50"
                              onClick={() => handleEditClick(appointment)}
                              title="Edit Appointment"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                          )}
                        </div>
                        {appointment?.Comments && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-gray-50 rounded-md border-l-2 border-l-blue-400">
                            <MessageSquare className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-700 leading-relaxed">
                              {appointment.Comments}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Physio Row */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-md">
                      <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-800 text-sm">
                        Dr. {appointment.Physio} PT
                      </span>
                    </div>
                    
                    {/* Time Row */}
                    <div className="space-y-2 mb-3">
                      { !!appointment.AppointmentTime && <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                        <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-green-700 text-sm font-medium">
                          {formatAppointmentTime(appointment.AppointmentDate, appointment.AppointmentTime)}
                        </span>
                      </div>}
                      {calculateWaitingTime(appointment?.CheckInTime, appointment?.StartTime) !== null && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-amber-50 p-2 rounded-md">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          <span>
                            Waiting: {format(appointment?.CheckInTime, 'h:mm a')} - {format(appointment?.StartTime, 'h:mm a')} ({calculateWaitingTime(appointment.CheckInTime, appointment.StartTime)} mins)
                          </span>
                        </div>
                      )}
  
                      {calculateWaitingTime(appointment?.StartTime, appointment?.EndTime) !== null && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded-md">
                          <Clock className="h-3.5 w-3.5 text-blue-600" />
                          <span>
                            Session: {format(appointment?.StartTime, 'h:mm a')} - {format(appointment?.EndTime, 'h:mm a')} ({calculateWaitingTime(appointment?.StartTime, appointment?.EndTime)} mins)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Amount Row */}
                    {appointment.IsInvoiceGenerated && <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                      <span className="text-sm font-semibold text-blue-700">
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
                    <div className="flex-1 space-y-3">
                      {/* Header Row: Date and Physio */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <h3 className="text-lg font-bold text-gray-900">
                                {new Date(appointment.AppointmentDate).toLocaleDateString()}
                              </h3>
                            </div>
                            {(appointment?.EndTime || appointment?.Status) && (
                              <span className={`text-xs font-semibold ${ appointment?.EndTime ? "bg-green-100 text-green-700 border border-green-200" : getStatusColor(appointment?.Status)} px-3 py-1.5 rounded-full`}>
                               {appointment.EndTime ? "Treated" : appointment?.Status }
                              </span>
                            )}
                          </div>
                          {appointment?.Comments && (
                            <div className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-md border-l-2 border-l-blue-400">
                              <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700 leading-relaxed">
                                {appointment.Comments}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-800">Dr. {appointment.Physio} PT</span>
                          </div>
                          {!isPatientClosed && appointment?.Status !== "Cancelled" && !appointment?.IsPatientCheckedIn && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 hover:bg-blue-50"
                              onClick={() => handleEditClick(appointment)}
                              title="Edit Appointment"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Time Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       { !!appointment.AppointmentTime &&
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                          <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-green-700 font-medium text-sm">
                            {formatAppointmentTime(appointment.AppointmentDate, appointment.AppointmentTime)}
                          </span>
                        </div>}
                        {!!appointment.CheckInTime && !!appointment.StartTime && calculateWaitingTime(appointment?.CheckInTime, appointment?.StartTime) !== null && (
                          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span className="text-sm text-gray-700">
                              Waiting: {format(appointment?.CheckInTime, 'h:mm a')} - {format(appointment?.StartTime, 'h:mm a')} ({calculateWaitingTime(appointment.CheckInTime, appointment.StartTime)} mins)
                            </span>
                          </div>
                        )}
                        {!!appointment.StartTime && !!appointment.EndTime && calculateWaitingTime(appointment?.StartTime, appointment?.EndTime) !== null && (
                          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                            <Clock className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-sm text-gray-700">
                              Session: {format(appointment?.StartTime, 'h:mm a')} - {format(appointment?.EndTime, 'h:mm a')} ({calculateWaitingTime(appointment?.StartTime, appointment?.EndTime)} mins)
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Amount Row */}
                      {appointment.IsInvoiceGenerated && <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-md border border-blue-200">
                        <span className="text-sm font-semibold text-blue-700">
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

        {/* Edit Appointment Form */}
        {selectedAppointment && (
          <RescheduleConfirmAppointmentForm
            appointment={selectedAppointment}
            openIcon={editFormOpen}
            onOpenIconChange={(open) => {
              setEditFormOpen(open);
              if (!open) {
                setSelectedAppointment(null);
                fetchAppointments(); // Refresh appointments when form closes
              }
            }}
            notDialogTrigger={true}
          />
        )}
      </div>
    );
  };

  export default PatientAppointmentTab;