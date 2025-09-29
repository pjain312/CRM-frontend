import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Calendar, CalendarDays, Users, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { getPendingCounts } from "../../services/appointment-service"
import { useEffect } from "react"

const PendingCounts = () => {
  const { data: pendingCounts, isLoading, error } = useQuery({
    queryKey: ["pending-counts"],
    queryFn: getPendingCounts,
  });

  useEffect(() => {
    console.log(pendingCounts);
  }, [pendingCounts]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Counts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Counts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-red-500">Error loading data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Define the display labels for each key
  const getDisplayInfo = (key) => {
    switch (key) {
      case 'PendingFollowUps':
        return {
          title: 'Pending Followup',
          description: 'Patients requiring follow-up',
          icon: Clock,
          color: 'bg-orange-100 text-orange-700 hover:bg-orange-100'
        };
      case 'TodayLeads':
        return {
          title: 'New Leads',
          description: 'New leads for today',
          icon: Users,
          color: 'bg-green-100 text-green-700 hover:bg-green-100'
        };
      default:
        return {
          title: key,
          description: 'Count information',
          icon: Clock,
          color: 'bg-blue-100 text-blue-700 hover:bg-blue-100'
        };
    }
  };

  return (
    <Card className="w-full max-w-md mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Pending Counts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingCounts && Object.keys(pendingCounts).map((key) => {
            const displayInfo = getDisplayInfo(key);
            const IconComponent = displayInfo.icon;
            
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <IconComponent className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{displayInfo.title}</p>
                    <p className="text-sm text-gray-600">{displayInfo.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-xs ${displayInfo.color}`}>
                  {pendingCounts[key] || 0}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default PendingCounts;
