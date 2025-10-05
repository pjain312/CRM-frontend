import {
  BadgeCheck,
  CalendarCheck,
  CalendarPlus,
  CalendarX,
  CheckCircle,
  CircleCheckBig,
  Clock,
  MessageCircle,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleAppointmentForm from "../../components/schedule-appointment-form";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import CheckoutPatientForm from "../../components/checkout-patient-form";
import PackageInvoice from "../../components/package-invoice";
import DailyInvoice from "../../components/daily-invoice";
import { parse, format } from "date-fns";

const CompletedAppointmentCard = ({ appointmentData, value }) => {
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);
  const [openScheduleAppt, setOpenScheduleAppt] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showPackageInvoice, setShowPackageInvoice] = useState(false);
  const [showDailyInvoice, setShowDailyInvoice] = useState(false);
  const popupRef = useRef(null);
  const iconRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePatientProfileClick = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const calculateTimeDifference = (startTime, endTime) => {
    if (!startTime || !endTime) return null;
    
    try {
      const start = parse(startTime, 'yyyy-MM-dd HH:mm:ss', new Date());
      const end = parse(endTime, 'yyyy-MM-dd HH:mm:ss', new Date());
      
      const diffInMs = end.getTime() - start.getTime();
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));
      
      return diffInMinutes;
    } catch (error) {
      return null;
    }
  };

  if (!appointmentData || appointmentData.length === 0) {
    return (
      <Card className="p-8">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
            <CalendarX className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              `No {value} appointments found`
            </h3>
            <p className="text-sm text-gray-500">
              There are no appointments to display at the moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {appointmentData?.map((appointment) => {
          return (
            <Card
              key={appointment.AppointmentId}
              className="p-4 shadow-sm w-full"
            >
              <CardContent className="flex items-start gap-4 p-0">
                <Avatar 
                  className="h-12 w-12 bg-blue-100 cursor-pointer hover:bg-blue-200 transition-colors"
                  onClick={() => handlePatientProfileClick(appointment.PatientId)}
                  title="Click to view patient profile"
                >
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {appointment.Name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handlePatientProfileClick(appointment.PatientId)}
                      title="Click to view patient profile"
                    >
                      {appointment.Gender === "Male" ? "Mr. " : "Ms. "} 
                      {appointment.Name}
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

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>Scheduled at: {appointment.AppointmentTime}</span>
                  </div>

                  {appointment.StartTime && appointment.EndTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-green-400" />
                      <span>Duration: {format(appointment?.StartTime, 'h:mm a')}-{format(appointment?.EndTime, 'h:mm a')} ({calculateTimeDifference(appointment?.StartTime, appointment?.EndTime)} mins)</span>
                    </div>
                  )}

                  {!!appointment?.IsInvoiceGenerated && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BadgeCheck className="h-4 w-4 text-green-500" />
                      <span>Invoiced</span>
                    </div>
                  )}
                  {!!appointment?.IsFollowUpCreated && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarCheck className="h-4 w-4 text-green-500" />
                      <span>Follow-up Created</span>
                    </div>
                  )}
                   {!!appointment?.IsPatientClosed && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CircleCheckBig className="h-4 w-4 text-green-500" />
                      <span>Patient Closed</span>
                    </div>
                  )}
                </div>

                {/* Action Icon */}
                <div className="flex-shrink-0 relative flex">
                  {!!(appointment.StatusId == 3) && (
                    <div
                      ref={iconRef}
                      title="Reason of cancellation"
                      className="h-8 w-8 bg-pink-300 mr-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-400 transition-colors"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setPopupOpen(!popupOpen);
                      }}
                    >
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                  )}

                  {!!(
                    appointment.EndTime && !appointment.IsInvoiceGenerated
                  ) && (
                    <div
                      title="Checkout Patient"
                      onClick={() => {
                        setCheckoutOpen(true);
                        setSelectedAppointment(appointment);
                      }}
                      className="h-8 w-8 bg-red-300 cursor-pointer hover:bg-red:400 rounded-full flex items-center justify-center mr-2"
                    >
                      <UserCheck className="h-5 w-5 text-white" />
                    </div>
                  )}

                  {!!(!appointment?.IsFollowUpCreated && !appointment?.IsPatientClosed) && (
                    <div
                      title="Create Follow-up"
                      className="h-8 w-8 bg-green-300 mr-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-400 transition-colors"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setOpenScheduleAppt(true);
                      }}
                    >
                      <CalendarPlus className="h-5 w-5 text-white" />
                    </div>
                  )}

                  {popupOpen &&
                    selectedAppointment?.AppointmentId ===
                      appointment.AppointmentId && (
                      <div
                        ref={popupRef}
                        className="absolute top-0 right-5 w-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50"
                      >
                        {selectedAppointment.Comments && (
                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Reason: {selectedAppointment.Comments}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {!!openScheduleAppt && (
        <ScheduleAppointmentForm
          patient={{
            ...selectedAppointment,
            Id: selectedAppointment.PatientId,
          }}
          notDialogTrigger={true}
          openIcon={openScheduleAppt}
          onOpenIconChange={setOpenScheduleAppt}
        />
      )}

      {checkoutOpen && (
        <CheckoutPatientForm
          session={selectedAppointment}
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          setShowPackageInvoice={setShowPackageInvoice}
          setShowDailyInvoice={setShowDailyInvoice}
        />
      )}
      {showPackageInvoice && (
        <PackageInvoice
          appointment={selectedAppointment}
          open={showPackageInvoice}
          onOpenChange={setShowPackageInvoice}
        />
      )}
      {showDailyInvoice && (
        <DailyInvoice
          appointment={selectedAppointment}
          open={showDailyInvoice}
          onOpenChange={setShowDailyInvoice}
        />
      )}
    </>
  );
};

export default CompletedAppointmentCard;
