import { CalendarX, Clock, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";

const CompletedAppointmentCard = ({appointmentData, value}) =>{
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
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {appointmentData?.map((appointment) => {
                return (
                    <Card key={appointment.AppointmentId} className="p-4 shadow-sm w-full max-w-2xl">
                        <CardContent className="flex items-center gap-4 p-0">
                            {/* Avatar Section */}
                            <Avatar className="h-12 w-12 bg-blue-100">
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                    {appointment.Name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* Content Section */}
                            <div className="flex-1 space-y-1">
                                {/* Patient and Doctor Name */}
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">
                                        {appointment.Gender === "Male" ? "Mr.": "Ms."}{appointment.Name}
                                    </span>
                                </div>

                                {/* Phone Number */}
                                <div className="text-sm text-gray-600">
                                    {appointment.PhoneNumber}
                                </div>

                                {/* Scheduled Time */}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-red-400" />
                                    <span>
                                        Scheduled at: {appointment.AppointmentTime}
                                    </span>
                                </div>

                                {/* Status */}
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

                                {/* Follow-up Status */}
                                {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Follow-up created</span>
                                </div> */}
                            </div>

                            {/* Action Icon */}
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-pink-500 rounded-full flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default CompletedAppointmentCard;