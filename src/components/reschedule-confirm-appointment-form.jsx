import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { recheduleConfirmAppointmentFormSchema } from "../lib/form-validation";
import { getAllTimeSlots, getAppointmentDefaultOptions, updateAppointment } from "../services/appointment-service";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

import { toast } from "sonner";

const RescheduleConfirmAppointmentForm = ({ appointment, openIcon, onOpenIconChange, notDialogTrigger}) => {
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
      appointmentTime: "" ,
      status: appointment?.StatusId?.toString(),
      comments: "",
    };
  }, []);

  const form = useForm({
    resolver: zodResolver(recheduleConfirmAppointmentFormSchema),
    defaultValues: defaultAppointmentValues
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment-today"] });
      toast.success(`Appointment ${appointment?.Status === "Pending" ? "Confirmed" : "Rescheduled"} Successfully`);
      setOpen(false);
      form.reset(defaultAppointmentValues);
      if (openIcon && onOpenIconChange) {
        onOpenIconChange(false);
      }
    },
    onError: () => {
      toast.error(`Appointment Failed to ${appointment?.Status === "Pending" ? "Confirm" : "Reschedule"}`);
    },
  });

  function onSubmit(values) {
    mutate({ ...values, appointmentId: appointment.AppointmentId });
  }
  const onOpenChange = ()=>{
    setOpen(false);
    openIcon && onOpenIconChange(false)
  }

  return (
    <Dialog open={open || openIcon} onOpenChange={onOpenChange}>
      {!notDialogTrigger && <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        {appointment?.Status === "Pending" ? "Confirm Appointment" : "Reschedule Appointment"}
      </DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] md:max-w-[525px] lg:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{appointment?.Status === "Pending" ? "Confirm Appointment" : "Reschedule Appointment"}          </DialogTitle>
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
                      {appointmentDefaultOptions?.appointmentStatusList?.map(a=>{
                        return <SelectItem key={a.Id} value={a.Id?.toString()}>{a.Name}</SelectItem>
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
                      placeholder={appointment?.Status === "Pending"? "Enter any additional notes for this appointment" : "Enter reason of reschedule"}
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
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">
                {appointment?.Status === "Pending" ? "Confirm Appointment" : "Reschedule Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleConfirmAppointmentForm;
