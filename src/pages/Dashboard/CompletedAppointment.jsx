import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";
import CompletedAppointmentCard from "./CompletedAppointmentCard";

const CompletedAppointment = ({ appointmentDetails }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Completed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="treated">Treated</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <CompletedAppointmentCard appointmentData={appointmentDetails} />
          </TabsContent>
          <TabsContent value="treated">
            <CompletedAppointmentCard
              value="treated"
              appointmentData={appointmentDetails?.filter(
                (appointment) => appointment.EndTime
              )}
            />
          </TabsContent>
          <TabsContent value="cancelled">
            <CompletedAppointmentCard
              value="cancelled"
              appointmentData={appointmentDetails?.filter(
                (appointment) => appointment.StatusId == 3
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompletedAppointment;
