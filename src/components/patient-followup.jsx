import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  PhoneIcon,
  UserIcon,
  MessageSquareIcon,
  ClockIcon,
} from "lucide-react";
import DatePicker from "./date-picker";
import {
  getLeadDetailsForFollowUp,
  saveFollowUpData,
} from "../services/leads-service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function PatientFollowup({ patient }) {
  const [open, setOpen] = useState(false);
  const [followupComment, setFollowupComment] = useState("");
  const [nextFollowupDate, setNextFollowupDate] = useState();

  const { data: followUpData } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: () => getLeadDetailsForFollowUp({ id: patient.Id }),
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: saveFollowUpData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add-follow-up"] });
      toast.success("Follow Up Added!");
      setOpen(false);
    },
    onError: () => {
      toast.error("Follow Up Failed to Add");
    },
  });

  const handleSave = () => {
    const payload = {
      leadId: patient.Id,
      followUpComment: followupComment,
      nextFollowUpDate: nextFollowupDate,
    };
    mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex px-2 w-full hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        Follow Up
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-balance">
            Patient Follow-up
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserIcon className="h-5 w-5" />
                Patient Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-base font-semibold">{patient.Name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p className="text-base">{patient.Age} years old</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-base">{patient.Gender}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-base flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    {patient.PhoneNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Last Follow-up Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClockIcon className="h-5 w-5" />
                Last Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followUpData?.LastFollowUpComment ? (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Previous Comment:
                  </p>
                  <p className="text-base leading-relaxed">
                    {followUpData?.LastFollowUpComment}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No previous follow-up comments available.
                </p>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Current Follow-up Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquareIcon className="h-5 w-5" />
                Current Follow-up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="followupComment"
                  className="text-base font-medium"
                >
                  Follow-up Comment
                </label>
                <textarea
                  id="followupComment"
                  placeholder="Enter your follow-up notes and observations..."
                  value={followupComment}
                  onChange={(e) => setFollowupComment(e.target.value)}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium">
                  Next Follow-up Date
                </label>
                <DatePicker
                  date={nextFollowupDate}
                  onDateChange={setNextFollowupDate}
                  placeholder="Select next follow-up date"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-12 text-base font-medium"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 h-12 text-base font-medium"
                >
                  <MessageSquareIcon className="h-4 w-4 mr-2" />
                  Save Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PatientFollowup;
