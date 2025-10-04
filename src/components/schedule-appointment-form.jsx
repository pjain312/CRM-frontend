import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { appointmentFormSchema } from "../lib/form-validation";
import {
  addAppointment,
  getAllTimeSlots,
  getAppointmentDefaultOptions
} from "../services/appointment-service";
import DatePicker from "./date-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

import { toast } from "sonner";

const ScheduleAppointmentForm = ({
  patient,
  openIcon,
  onOpenIconChange,
  notDialogTrigger,
}) => {
  const [open, setOpen] = useState(false);

  const { data: appointmentDefaultOptions } = useQuery({
    queryKey: ["appointment-default-options"],
    queryFn: getAppointmentDefaultOptions,
  });

  const { data: timeSlots } = useQuery({
    queryKey: ["time-slots"],
    queryFn: getAllTimeSlots,
  });

  const defaultAppointmentValues = useMemo(() => {
    return {
      appointmentDate: "",
      appointmentTime: "",
      appointmentType: "",
      status: "",
      comments: "",
      physio: "",
    };
  }, []);

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: defaultAppointmentValues,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: addAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment-today"] });
      toast.success("Appointment Scheduled Successfully");
      form.reset(defaultAppointmentValues);
      setOpen(false);
      onOpenIconChange && onOpenIconChange(false);
    },
    onError: () => {
      toast.error("Appointment Failed to Schedule");
    },
  });
  const handleDialogClose = () => {
    form.reset(defaultAppointmentValues);
    setOpen(false);
    onOpenIconChange && onOpenIconChange(false);
  };

  function onSubmit(values) {
    mutate({ ...values, patientId: patient.Id });
  }

  const handleCloseButton = () => {
    form.reset(defaultAppointmentValues);
    setOpen(false);
    onOpenIconChange && onOpenIconChange(false);
  };

  return (
    <Dialog open={open || openIcon} onOpenChange={handleDialogClose}>
      {!notDialogTrigger && (
        <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
          Schedule Appointment
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            Sehedule an appointment for a patient.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("validation errors", errors);
            })}
            className="grid grid-cols-2 gap-3"
          >
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                          placeholder="Select event date"
                          className="w-full"
                        />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                     {timeSlots?.map(t => {
                      return <SelectItem key={t.Id} value={t.StartTime}>{t.Slot}</SelectItem>
                     })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Consultation</SelectItem>
                      <SelectItem value="2">Treatment</SelectItem>
                      <SelectItem value="3">Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointmentDefaultOptions?.appointmentStatusList?.map(
                        (a) => {
                          return (
                            <SelectItem key={a.Id} value={a.Id?.toString()}>
                              {a.Name}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="physio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Physio</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Physio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointmentDefaultOptions?.physioList?.map((a) => {
                        return (
                          <SelectItem key={a.Id} value={a.Id?.toString()}>
                            Dr. {a.Name} PT
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes for this appointment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="col-span-2">
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  onClick={handleCloseButton}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Scheduling..."
                  : "Schedule Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentForm;
