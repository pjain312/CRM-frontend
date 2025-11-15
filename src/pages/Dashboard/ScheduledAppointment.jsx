import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Calendar } from "lucide-react"
import AppointmentCard from "./AppointmentCard"

const ScheduledAppointment = ({appointmentDetails}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Scheduled
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <AppointmentCard appointmentData={appointmentDetails} />
          </TabsContent>
          <TabsContent value="confirmed">
            <AppointmentCard value="confirmed" appointmentData={appointmentDetails?.filter(appointment => appointment.StatusId == 1 && !appointment.EndTime)}/>
          </TabsContent>
          <TabsContent value="pending">
            <AppointmentCard value="pending" appointmentData={appointmentDetails?.filter(appointment => appointment.StatusId == 2 && !appointment.EndTime)}/>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ScheduledAppointment;
