import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

// Form validation schema
const followUpSchema = z.object({
  followupComment: z.string().min(1, "Follow-up comment is required"),
  nextFollowupDate: z.string().min(1, "Next follow-up date is required"),
});

function PatientFollowup({ patient }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      followupComment: "",
      nextFollowupDate: "",
    },
  });

  const { data: followUpData } = useQuery({
    queryKey: ["add-follow-up"],
    queryFn: () => getLeadDetailsForFollowUp({ id: patient.Id }),
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: saveFollowUpData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add-follow-up"] });
      toast.success("Follow Up Added!");
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Follow Up Failed to Add");
    },
  });

  const handleCloseFollowUpDialog = () => {
    setOpen(false);
    form.reset();
  }

  const onSubmit = (values) => {
    const payload = {
      leadId: patient.Id,
      followUpComment: values.followupComment,
      nextFollowUpDate: values.nextFollowupDate,
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
          <DialogDescription>
            Add follow-up notes and schedule next appointment for this patient.
          </DialogDescription>
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
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground font-medium">
                      Previous Comment:
                    </p>
                    {followUpData?.LastFollowUpDate && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ClockIcon className="h-3.5 w-3.5" />
                        <span>
                          {new Date(followUpData.LastFollowUpDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="followupComment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Follow-up Comment *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your follow-up notes and observations..."
                            rows={4}
                            disabled={followUpData?.FollowUpCount >= 3}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        {followUpData?.FollowUpCount === 3 && (
                          <p className="text-sm text-muted-foreground">
                            You have reached the maximum number of follow-ups. Comments
                            are disabled.
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nextFollowupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Next Follow-up Date *
                        </FormLabel>
                        <FormControl>
                          {followUpData?.FollowUpCount >= 2 ? (
                            <p className="text-sm text-muted-foreground">
                              Date selection is disabled after two follow-ups.
                            </p>
                          ) : (
                            <DatePicker
                              date={field.value}
                              onDateChange={field.onChange}
                              placeholder="Select next follow-up date"
                              className="w-full"
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseFollowUpDialog}
                      className="flex-1 h-12 text-base font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 text-base font-medium"
                    >
                      <MessageSquareIcon className="h-4 w-4 mr-2" />
                      Save Follow-up
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PatientFollowup;
