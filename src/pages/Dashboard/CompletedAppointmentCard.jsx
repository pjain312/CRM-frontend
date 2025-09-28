import { BadgeCheck, CalendarPlus, CalendarX, CheckCircle, Clock, MessageCircle, UserCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ScheduleAppointmentForm from "../../components/schedule-appointment-form";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import CheckoutPatientForm from "../../components/checkout-patient-form";
import PackageInvoice from "../../components/package-invoice";

const CompletedAppointmentCard = ({appointmentData, value}) =>{
    const [popupOpen, setPopupOpen] = useState(false);
    const [openScheduleAppt, setOpenScheduleAppt] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [showPackageInvoice, setShowPackageInvoice] = useState(false);
    const popupRef = useRef(null);
    const iconRef = useRef(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) && 
                iconRef.current && !iconRef.current.contains(event.target)) {
                setPopupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
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

    return(
        <>
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {appointmentData?.map((appointment) => {
                return (
                    <Card key={appointment.AppointmentId} className="p-4 shadow-sm w-full max-w-2xl">
                        <CardContent className="flex items-center gap-4 p-0">

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

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {"Dr."} {appointment.PhysioName}
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

                                {/* Follow-up Status */}
                               { appointment?.IsInvoiceGenerated && 
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <BadgeCheck className="h-4 w-4 text-green-500" />
                                        <span>Invoiced</span>
                                </div>
                                }
                            </div>

                            {/* Action Icon */}
                            <div className="flex-shrink-0 relative flex">
                                { !!(appointment.StatusId ==3) && <div 
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
                                }

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

                               {!!(appointment.EndTime && !appointment.IsInvoiceGenerated) &&
                                <div title = "Checkout Patient" 
                                onClick={()=> {
                                    setCheckoutOpen(true);
                                    setSelectedAppointment(appointment)
                                }} 
                                className="h-8 w-8 bg-red-300 cursor-pointer hover:bg-red:400 rounded-full flex items-center justify-center mr-2">
                                    <UserCheck className="h-5 w-5 text-white" />
                                </div>}
                                
                                {popupOpen && selectedAppointment?.AppointmentId === appointment.AppointmentId && (
                                    <div 
                                        ref={popupRef}
                                        className="absolute top-0 right-5 w-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50"
                                    >
                                                {selectedAppointment.Comments && (
                                                    <div >
                                                        <span className="text-xs font-medium text-gray-600">Reason: {selectedAppointment.Comments}</span>
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
        {!!openScheduleAppt &&
            <ScheduleAppointmentForm patient = {{...selectedAppointment, Id: selectedAppointment.PatientId} } notDialogTrigger={true} openIcon={openScheduleAppt} onOpenIconChange ={setOpenScheduleAppt}/>
        }

        {checkoutOpen && <CheckoutPatientForm session={selectedAppointment} open={checkoutOpen} onOpenChange={setCheckoutOpen} setShowPackageInvoice = {setShowPackageInvoice}/>}
        {showPackageInvoice && <PackageInvoice appointment={selectedAppointment} open={showPackageInvoice} onOpenChange={setShowPackageInvoice} />}

    </>
    )
}

export default CompletedAppointmentCard;