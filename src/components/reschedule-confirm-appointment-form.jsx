import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { recheduleConfirmAppointmentFormSchema } from "../lib/form-validation";
import { getAppointmentDefaultOptions, updateAppointment } from "../services/appointment-service";
import { TimePicker } from "./time-picker";
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

const RescheduleConfirmAppointmentForm = ({ appointment }) => {
  const [open, setOpen] = useState(false);

  const { data: appointmentDefaultOptions } = useQuery({
    queryKey: ["appointment-default-options"],
    queryFn: getAppointmentDefaultOptions,
  });

  const form = useForm({
    resolver: zodResolver(recheduleConfirmAppointmentFormSchema),
    defaultValues: {
      appointmentTime: "" ,
      status: appointment?.StatusId?.toString(),
      comments: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
      toast.success(`Appointment ${appointment?.Status === "Pending" ? "Confirmed" : "Rescheduled"} Successfully`);
      setOpen(false);
    },
    onError: () => {
      toast.error(`Appointment Failed to ${appointment?.Status === "Pending" ? "Confirm" : "Reschedule"}`);
    },
  });

  function onSubmit(values) {
    mutate({ ...values, appointmentId: appointment.AppointmentId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex px-2 hover:bg-accent font-normal py-1.5 text-sm rounded-sm">
        {appointment?.Status === "Pending" ? "Confirm Appointment" : "Reschedule Appointment"}
      </DialogTrigger>
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
                  <FormControl>
                    <TimePicker
                      time={field.value}
                      onTimeChange={(time) => {
                        field.onChange(time);
                        form.setValue("status", "1"); // Assuming "2" is the confirmed status
                      }}
                      placeholder="Select appointment time"
                      className="w-full"
                    />
                  </FormControl>
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
                        return <SelectItem value={a.Id?.toString()}>{a.Name}</SelectItem>
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
